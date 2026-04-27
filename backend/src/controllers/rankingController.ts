import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { isBlacklisted } from "../lib/blacklist";
import { decrypt } from "../lib/crypto";
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

// GET /ranking/me
export async function getMyRanking(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { turma: true },
  });

  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  // ranking escola inteira
  const allPoints = await prisma.userPoints.findMany({
    orderBy: { total: "desc" },
    select:  { userId: true, total: true },
  });

  const schoolRank = allPoints.findIndex((p) => p.userId === userId) + 1;

  // ranking da turma
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

  const turmaRank   = turmaPoints.findIndex((p) => p.userId === userId) + 1;
  const myPoints    = allPoints.find((p) => p.userId === userId);

  return reply.send({
    totalPoints: myPoints?.total ?? 0,
    schoolRank:  schoolRank === 0 ? null : schoolRank,
    turmaRank:   turmaRank  === 0 ? null : turmaRank,
  });
}
