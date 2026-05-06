import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { isBlacklisted } from "../lib/blacklist";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

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

// GET /profile/:userId
export async function getPublicProfile(req: FastifyRequest, reply: FastifyReply) {
  const requesterId = await getUserFromToken(req, reply);
  if (!requesterId) return;

  const { userId } = req.params as { userId: string };

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, name: true, avatarUrl: true, turma: true },
  });

  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  const [userPoints, scans, allPoints, turmaUsers] = await Promise.all([
    prisma.userPoints.findUnique({ where: { userId } }),
    prisma.scan.findMany({
      where:   { userId },
      orderBy: { createdAt: "desc" },
      take:    20,
      select:  { id: true, category: true, points: true, createdAt: true },
    }),
    prisma.userPoints.findMany({ orderBy: { total: "desc" }, select: { userId: true } }),
    prisma.user.findMany({ where: { turma: user.turma }, select: { id: true } }),
  ]);

  const schoolRank = allPoints.findIndex((p) => p.userId === userId) + 1;

  const turmaIds    = turmaUsers.map((u) => u.id);
  const turmaPoints = await prisma.userPoints.findMany({
    where:   { userId: { in: turmaIds } },
    orderBy: { total: "desc" },
    select:  { userId: true },
  });
  const turmaRank = turmaPoints.findIndex((p) => p.userId === userId) + 1;

  // streak
  const toDateStr  = (d: Date) => d.toISOString().slice(0, 10);
  const activeDays = new Set(scans.map((s) => toDateStr(new Date(s.createdAt))));
  const today      = toDateStr(new Date());
  const yesterday  = toDateStr(new Date(Date.now() - 86_400_000));
  const startDay   = activeDays.has(today) ? today : activeDays.has(yesterday) ? yesterday : null;

  let streak  = 0;
  if (startDay) {
    let current = new Date(startDay + "T12:00:00Z");
    while (activeDays.has(toDateStr(current))) {
      streak++;
      current = new Date(current.getTime() - 86_400_000);
    }
  }

  return reply.send({
    user:        { ...user },
    totalPoints: userPoints?.total ?? 0,
    totalScans:  scans.length,
    scans,
    schoolRank:  schoolRank === 0 ? null : schoolRank,
    turmaRank:   turmaRank  === 0 ? null : turmaRank,
    streak,
  });
}
