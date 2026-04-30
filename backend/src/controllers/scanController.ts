import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { isBlacklisted } from "../lib/blacklist";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

// pontos por categoria
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

  // salva o scan
  const scan = await prisma.scan.create({
    data: { userId, category, points, imageUrl },
  });

  // atualiza ou cria o total de pontos
  await prisma.userPoints.upsert({
    where:  { userId },
    update: { total: { increment: points } },
    create: { userId, total: points },
  });

  const userPoints = await prisma.userPoints.findUnique({ where: { userId } });

  return reply.status(201).send({
    scan,
    pointsEarned: points,
    totalPoints:  userPoints?.total ?? points,
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
