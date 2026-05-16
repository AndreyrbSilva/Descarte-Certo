import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../services/authService";
import { computeStreak } from "../services/streakService";
import { updateMissionProgress } from "./missionController";
import { checkAndUnlockAchievements } from "./achievementController";

const POINTS_MAP: Record<string, number> = {
  plastico: 10,
  papel:    10,
  metal:    10,
  organico: 10,
  vidro:    10,
};

const scanSchema = z.object({
  category: z.enum(
    ["plastico", "papel", "metal", "organico", "vidro"],
    { errorMap: () => ({ message: "Categoria inválida." }) }
  ),
  imageUrl: z.string().url("URL de imagem inválida.").optional(),
});

// POST /scan
export async function registerScan(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const parsed = scanSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const { category, imageUrl } = parsed.data;
  const points = POINTS_MAP[category];

  const scan = await prisma.scan.create({
    data: { userId, category, points, imageUrl },
  });

  await prisma.userPoints.upsert({
    where:  { userId },
    update: { total: { increment: points } },
    create: { userId, total: points },
  });

  const [userPoints, streak, missionUpdate] = await Promise.all([
    prisma.userPoints.findUnique({ where: { userId } }),
    computeStreak(userId),
    updateMissionProgress(userId, category),
  ]);

  // Verifica conquistas desbloqueadas
  const newAchievements = await checkAndUnlockAchievements(userId);

  // Recalcula pontos se houve bônus de conquistas
  const finalPoints = newAchievements.length > 0
    ? (await prisma.userPoints.findUnique({ where: { userId } }))?.total ?? (userPoints?.total ?? points)
    : (userPoints?.total ?? points);

  return reply.status(201).send({
    scan,
    pointsEarned: points,
    totalPoints:  finalPoints,
    streak,
    mission: missionUpdate
      ? {
          title: missionUpdate.mission.title,
          progress: missionUpdate.progress,
          target: missionUpdate.mission.target,
          completed: missionUpdate.completed,
          reward: missionUpdate.mission.reward,
        }
      : null,
    newAchievements,
  });
}

// GET /scan/history
export async function getScanHistory(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const scans = await prisma.scan.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    take:    20,
  });

  return reply.send({ scans });
}

// GET /scan/points
export async function getUserPoints(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const userPoints = await prisma.userPoints.findUnique({ where: { userId } });
  return reply.send({ total: userPoints?.total ?? 0 });
}

// GET /scan/streak
export async function getStreak(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  return reply.send({ streak: await computeStreak(userId) });
}
