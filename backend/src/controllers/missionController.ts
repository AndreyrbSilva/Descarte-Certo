import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../services/authService";

// ── Helpers ──────────────────────────────────────────────

/** Retorna início do dia em UTC-3 (horário de Brasília) */
function todayBrazil(): Date {
  const now = new Date();
  // UTC-3
  const brazil = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  brazil.setUTCHours(0, 0, 0, 0);
  return brazil;
}

/** Busca ou atribui a missão do dia para o usuário */
async function getOrAssignDailyMission(userId: string) {
  const startOfDay = todayBrazil();
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  // Já tem missão hoje?
  const existing = await prisma.userMissionProgress.findFirst({
    where: {
      userId,
      assignedAt: { gte: startOfDay, lt: endOfDay },
    },
    include: { mission: true },
  });

  if (existing) {
    return existing;
  }

  // Sorteia uma missão aleatória
  const allMissions = await prisma.dailyMission.findMany();
  if (allMissions.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * allMissions.length);
  const chosen = allMissions[randomIndex];

  const progress = await prisma.userMissionProgress.create({
    data: {
      userId,
      missionId: chosen.id,
      assignedAt: new Date(),
    },
    include: { mission: true },
  });

  return progress;
}

// ── Exported: atualiza progresso (chamado pelo scanController) ──

export async function updateMissionProgress(userId: string, category: string) {
  const startOfDay = todayBrazil();
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const userMission = await prisma.userMissionProgress.findFirst({
    where: {
      userId,
      assignedAt: { gte: startOfDay, lt: endOfDay },
    },
    include: { mission: true },
  });

  if (!userMission || userMission.completed) {
    return userMission;
  }

  const { mission } = userMission;

  // Verifica se o scan conta para esta missão
  if (mission.type === "scan_category" && mission.category !== category) {
    return userMission; // categoria não bate, não incrementa
  }

  const newProgress = userMission.progress + 1;
  const justCompleted = newProgress >= mission.target;

  const updated = await prisma.userMissionProgress.update({
    where: { id: userMission.id },
    data: {
      progress: newProgress,
      completed: justCompleted,
      completedAt: justCompleted ? new Date() : undefined,
      rewardClaimed: justCompleted,
    },
    include: { mission: true },
  });

  // Se completou agora, dá os pontos de recompensa
  if (justCompleted) {
    await prisma.userPoints.upsert({
      where: { userId },
      update: { total: { increment: mission.reward } },
      create: { userId, total: mission.reward },
    });
  }

  return updated;
}

// ── Route handler ────────────────────────────────────────

// GET /missions/daily
export async function getDailyMission(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const userMission = await getOrAssignDailyMission(userId);

  if (!userMission) {
    return reply.status(404).send({ error: "Nenhuma missão disponível." });
  }

  return reply.send({
    mission: {
      title: userMission.mission.title,
      description: userMission.mission.description,
      type: userMission.mission.type,
      target: userMission.mission.target,
      category: userMission.mission.category,
      reward: userMission.mission.reward,
    },
    progress: userMission.progress,
    completed: userMission.completed,
    rewardClaimed: userMission.rewardClaimed,
  });
}
