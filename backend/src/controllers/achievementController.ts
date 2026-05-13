import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { isBlacklisted } from "../lib/blacklist";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

// ── Auth helper ──────────────────────────────────────────
async function getUserFromToken(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    reply.status(401).send({ error: "Token não fornecido." });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    reply.status(401).send({ error: "Token inválido ou expirado." });
    return null;
  }

  const blocked = await isBlacklisted(token);
  if (blocked) {
    reply.status(401).send({ error: "Sessão encerrada. Faça login novamente." });
    return null;
  }

  const payload = jwt.decode(token) as { sub: string };
  return payload.sub;
}

// ── Helpers de ranking ──────────────────────────────────

async function computeStreak(userId: string): Promise<number> {
  const scans = await prisma.scan.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    select:  { createdAt: true },
  });

  if (scans.length === 0) return 0;

  const toDateStr  = (d: Date) => d.toISOString().slice(0, 10);
  const activeDays = new Set(scans.map((s) => toDateStr(s.createdAt)));
  const today      = toDateStr(new Date());
  const yesterday  = toDateStr(new Date(Date.now() - 86_400_000));

  const startDay = activeDays.has(today)
    ? today
    : activeDays.has(yesterday)
    ? yesterday
    : null;

  if (!startDay) return 0;

  let streak  = 0;
  let current = new Date(startDay + "T12:00:00Z");

  while (activeDays.has(toDateStr(current))) {
    streak++;
    current = new Date(current.getTime() - 86_400_000);
  }

  return streak;
}

async function getUserRankingPosition(userId: string, scope: "turma" | "escola"): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { turma: true },
  });
  if (!user) return null;

  if (scope === "turma") {
    const turmaUsers = await prisma.user.findMany({
      where:  { turma: user.turma },
      select: { id: true },
    });
    const turmaIds = turmaUsers.map((u) => u.id);
    const turmaPoints = await prisma.userPoints.findMany({
      where:   { userId: { in: turmaIds } },
      orderBy: { total: "desc" },
      select:  { userId: true },
    });
    const pos = turmaPoints.findIndex((p) => p.userId === userId) + 1;
    return pos === 0 ? null : pos;
  }

  // escola
  const allPoints = await prisma.userPoints.findMany({
    orderBy: { total: "desc" },
    select:  { userId: true },
  });
  const pos = allPoints.findIndex((p) => p.userId === userId) + 1;
  return pos === 0 ? null : pos;
}

// ── Snapshot mensal de ranking ───────────────────────────

async function takeMonthlySnapshotIfNeeded(userId: string) {
  const now   = new Date();
  const month = now.getMonth() + 1; // 1–12
  const year  = now.getFullYear();

  // Verifica se já tem snapshot desse mês
  const existing = await prisma.rankingSnapshot.findFirst({
    where: { userId, month, year },
  });
  if (existing) return;

  // Calcula posições
  const [turmaPos, escolaPos] = await Promise.all([
    getUserRankingPosition(userId, "turma"),
    getUserRankingPosition(userId, "escola"),
  ]);

  // Salva snapshots
  const snapshots = [];
  if (turmaPos) {
    snapshots.push({ userId, scope: "turma", position: turmaPos, month, year });
  }
  if (escolaPos) {
    snapshots.push({ userId, scope: "escola", position: escolaPos, month, year });
  }

  if (snapshots.length > 0) {
    for (const snap of snapshots) {
      await prisma.rankingSnapshot.upsert({
        where: { userId_scope_month_year: { userId: snap.userId, scope: snap.scope, month: snap.month, year: snap.year } },
        update: { position: snap.position },
        create: snap,
      });
    }
  }
}

// ── Verificação de consistência no ranking ──────────────

async function getConsecutiveMonthsInTop3(userId: string, scope: "turma" | "escola"): Promise<number> {
  const now   = new Date();
  let month   = now.getMonth() + 1;
  let year    = now.getFullYear();
  let count   = 0;

  // Conta meses anteriores consecutivos no top 3
  for (let i = 0; i < 12; i++) {
    // Checa mês anterior
    month--;
    if (month === 0) { month = 12; year--; }

    const snapshot = await prisma.rankingSnapshot.findUnique({
      where: { userId_scope_month_year: { userId, scope, month, year } },
    });

    if (snapshot && snapshot.position <= 3) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

// ── Check and Unlock ────────────────────────────────────

export async function checkAndUnlockAchievements(userId: string) {
  // Tira snapshot mensal se necessário
  await takeMonthlySnapshotIfNeeded(userId);

  // Busca todos os achievements que o usuário AINDA NÃO desbloqueou
  const userUnlocked = await prisma.userAchievement.findMany({
    where:  { userId },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(userUnlocked.map((u) => u.achievementId));

  const allAchievements = await prisma.achievement.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const locked = allAchievements.filter((a) => !unlockedIds.has(a.id));
  if (locked.length === 0) return [];

  // Busca estatísticas do usuário em paralelo
  const [
    totalScans,
    userPoints,
    streak,
    distinctCategories,
    missionsCompleted,
    turmaRank,
    escolaRank,
  ] = await Promise.all([
    prisma.scan.count({ where: { userId } }),
    prisma.userPoints.findUnique({ where: { userId } }),
    computeStreak(userId),
    prisma.scan.findMany({ where: { userId }, select: { category: true }, distinct: ["category"] }),
    prisma.userMissionProgress.count({ where: { userId, completed: true } }),
    getUserRankingPosition(userId, "turma"),
    getUserRankingPosition(userId, "escola"),
  ]);

  const totalPoints        = userPoints?.total ?? 0;
  const categoryCount      = distinctCategories.length;

  // Consistência (meses seguidos no top 3) — só calcula se há achievement de consistência pendente
  const hasConsistencyLocked = locked.some((a) => a.type === "ranking_consistency");
  let turmaConsistency  = 0;
  let escolaConsistency = 0;
  if (hasConsistencyLocked) {
    [turmaConsistency, escolaConsistency] = await Promise.all([
      getConsecutiveMonthsInTop3(userId, "turma"),
      getConsecutiveMonthsInTop3(userId, "escola"),
    ]);
  }

  // Mapa de tipo → valor atual
  const statsMap: Record<string, (a: typeof allAchievements[0]) => number> = {
    total_scans:         () => totalScans,
    total_points:        () => totalPoints,
    streak:              () => streak,
    category_diversity:  () => categoryCount,
    missions_completed:  () => missionsCompleted,
    ranking_turma:       () => turmaRank ?? 999,  // quanto menor, melhor
    ranking_escola:      () => escolaRank ?? 999,
    ranking_consistency: (a) => {
      // Chave determina se é turma ou escola
      if (a.key.startsWith("turma_consist"))  return turmaConsistency;
      if (a.key.startsWith("escola_consist")) return escolaConsistency;
      return 0;
    },
  };

  const newlyUnlocked: Array<{
    id: string;
    key: string;
    title: string;
    description: string;
    icon: string;
    type: string;
    reward: number;
  }> = [];

  for (const achievement of locked) {
    const getValue = statsMap[achievement.type];
    if (!getValue) continue;

    const currentValue = getValue(achievement);

    // Para ranking: threshold é a posição máxima (ex: top 3 = threshold 3, usuario precisa ter posição <= 3)
    const isRanking = achievement.type === "ranking_turma" || achievement.type === "ranking_escola";
    const met = isRanking
      ? currentValue <= achievement.threshold
      : currentValue >= achievement.threshold;

    if (met) {
      // Desbloqueia
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });

      // Pontos bônus
      if (achievement.reward > 0) {
        await prisma.userPoints.upsert({
          where:  { userId },
          update: { total: { increment: achievement.reward } },
          create: { userId, total: achievement.reward },
        });
      }

      newlyUnlocked.push({
        id:          achievement.id,
        key:         achievement.key,
        title:       achievement.title,
        description: achievement.description,
        icon:        achievement.icon,
        type:        achievement.type,
        reward:      achievement.reward,
      });
    }
  }

  return newlyUnlocked;
}

// ── Route handler: GET /achievements ────────────────────

export async function getUserAchievements(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const [allAchievements, userUnlocks, totalScans, userPoints, streak, distinctCats, missionsCompleted, turmaRank, escolaRank] =
    await Promise.all([
      prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } }),
      prisma.scan.count({ where: { userId } }),
      prisma.userPoints.findUnique({ where: { userId } }),
      computeStreak(userId),
      prisma.scan.findMany({ where: { userId }, select: { category: true }, distinct: ["category"] }),
      prisma.userMissionProgress.count({ where: { userId, completed: true } }),
      getUserRankingPosition(userId, "turma"),
      getUserRankingPosition(userId, "escola"),
    ]);

  const totalPoints   = userPoints?.total ?? 0;
  const categoryCount = distinctCats.length;
  const unlockedMap   = new Map(userUnlocks.map((u) => [u.achievementId, u.unlockedAt]));

  const progressMap: Record<string, number> = {
    total_scans:        totalScans,
    total_points:       totalPoints,
    streak:             streak,
    category_diversity: categoryCount,
    missions_completed: missionsCompleted,
    ranking_turma:      turmaRank ?? 0,
    ranking_escola:     escolaRank ?? 0,
    ranking_consistency: 0,
  };

  const achievements = allAchievements.map((a) => {
    const unlocked   = unlockedMap.has(a.id);
    const unlockedAt = unlockedMap.get(a.id) ?? null;

    let progress = progressMap[a.type] ?? 0;

    // Para ranking: mostra posição (invertido — quanto menor, melhor)
    // Para consistência: não calcula aqui por performance, mostra 0
    if (a.type === "ranking_turma" || a.type === "ranking_escola") {
      // Progresso invertido: se posição 5 e threshold 10, progresso = 10-5=5 de 10
      const pos = progress || 999;
      progress = pos <= a.threshold ? a.threshold : Math.max(0, a.threshold - (pos - a.threshold));
    }

    return {
      id:          a.id,
      key:         a.key,
      title:       a.title,
      description: a.description,
      icon:        a.icon,
      type:        a.type,
      threshold:   a.threshold,
      reward:      a.reward,
      unlocked,
      unlockedAt:  unlockedAt?.toISOString() ?? null,
      progress:    unlocked ? a.threshold : Math.min(progress, a.threshold),
    };
  });

  const totalCount    = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return reply.send({ achievements, totalCount, unlockedCount });
}
