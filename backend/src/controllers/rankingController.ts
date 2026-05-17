import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../services/authService";
import { computeStreak } from "../services/streakService";

// GET /ranking/me
export async function getMyRanking(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { turma: true },
  });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  const allPoints = await prisma.userPoints.findMany({
    orderBy: { total: "desc" },
    select:  { userId: true, total: true },
  });

  const schoolRank = allPoints.findIndex((p) => p.userId === userId) + 1;

  const turmaUsers = await prisma.user.findMany({
    where:  { turma: user.turma },
    select: { id: true },
  });

  const turmaIds    = turmaUsers.map((u) => u.id);
  const turmaPoints = await prisma.userPoints.findMany({
    where:   { userId: { in: turmaIds } },
    orderBy: { total: "desc" },
    select:  { userId: true, total: true },
  });

  const turmaRank = turmaPoints.findIndex((p) => p.userId === userId) + 1;
  const myPoints  = allPoints.find((p) => p.userId === userId);

  return reply.send({
    totalPoints: myPoints?.total ?? 0,
    schoolRank:  schoolRank === 0 ? null : schoolRank,
    turmaRank:   turmaRank  === 0 ? null : turmaRank,
  });
}

// GET /ranking/turma — top 20 da turma do usuário
export async function getTurmaRanking(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { turma: true },
  });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  const turmaUsers = await prisma.user.findMany({
    where:  { turma: user.turma },
    select: { id: true, name: true, avatarUrl: true },
  });

  const turmaIds = turmaUsers.map((u) => u.id);

  const points = await prisma.userPoints.findMany({
    where:   { userId: { in: turmaIds } },
    orderBy: { total: "desc" },
    take:    10,
    select:  { userId: true, total: true },
  });

  // streaks em paralelo
  const streaks = await Promise.all(points.map((p) => computeStreak(p.userId)));

  const ranking = points.map((p, i) => {
    const u = turmaUsers.find((u) => u.id === p.userId)!;
    return {
      position:  i + 1,
      userId:    p.userId,
      name:      u.name,
      avatarUrl: u.avatarUrl ?? null,
      points:    p.total,
      streak:    streaks[i],
      isMe:      p.userId === userId,
    };
  });

  return reply.send({ ranking, turma: user.turma });
}

// GET /ranking/escola — top 20 geral
export async function getEscolaRanking(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const points = await prisma.userPoints.findMany({
    orderBy: { total: "desc" },
    take:    15,
    select:  { userId: true, total: true },
  });

  const userIds = points.map((p) => p.userId);

  const users = await prisma.user.findMany({
    where:  { id: { in: userIds } },
    select: { id: true, name: true, avatarUrl: true, turma: true },
  });

  const streaks = await Promise.all(points.map((p) => computeStreak(p.userId)));

  const ranking = points.map((p, i) => {
    const u = users.find((u) => u.id === p.userId)!;
    return {
      position:  i + 1,
      userId:    p.userId,
      name:      u.name,
      avatarUrl: u.avatarUrl ?? null,
      turma:     u.turma,
      points:    p.total,
      streak:    streaks[i],
      isMe:      p.userId === userId,
    };
  });

  return reply.send({ ranking });
}
