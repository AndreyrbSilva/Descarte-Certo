import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../services/authService";
import { computeStreak } from "../services/streakService";

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

  const streak = await computeStreak(userId);

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
