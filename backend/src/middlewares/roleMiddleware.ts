import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "../services/authService";

/**
 * Middleware que exige role ADMIN.
 * Deve ser usado após verifyToken ou standalone (valida token internamente).
 */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return; // getUserFromToken já enviou 401

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return reply.status(403).send({ error: "Acesso restrito a administradores." });
  }

  (req as any).userId = userId;
}

/**
 * Middleware que exige role ADMIN ou TEACHER.
 */
export async function requireStaff(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
    return reply.status(403).send({ error: "Acesso restrito a professores e administradores." });
  }

  (req as any).userId = userId;
}
