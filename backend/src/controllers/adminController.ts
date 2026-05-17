import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// ─── schemas ────────────────────────────────────────────────────────────────

const changeRoleSchema = z.object({
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
    errorMap: () => ({ message: "Role inválida. Use: STUDENT, TEACHER ou ADMIN." }),
  }),
});

// ─── GET /admin/users — lista todos os usuários ─────────────────────────────

export async function listUsers(req: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      turma: true,
      role: true,
      avatarUrl: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return reply.send({ users, total: users.length });
}

// ─── PATCH /admin/users/:id/role — altera role de um usuário ────────────────

export async function changeUserRole(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const adminId = (req as any).userId;

  const parsed = changeRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  // Impede que o admin remova seu próprio papel
  if (id === adminId && parsed.data.role !== "ADMIN") {
    return reply.status(400).send({ error: "Você não pode remover seu próprio papel de administrador." });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  const updated = await prisma.user.update({
    where: { id },
    data:  { role: parsed.data.role },
    select: { id: true, name: true, email: true, turma: true, role: true },
  });

  return reply.send({ user: updated, message: `Role alterada para ${updated.role}.` });
}

// ─── DELETE /admin/users/:id — remove um usuário ────────────────────────────

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const adminId = (req as any).userId;

  if (id === adminId) {
    return reply.status(400).send({ error: "Você não pode deletar sua própria conta." });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  // Remove dados relacionados em cascata
  await prisma.$transaction([
    prisma.userAchievement.deleteMany({ where: { userId: id } }),
    prisma.userMissionProgress.deleteMany({ where: { userId: id } }),
    prisma.rankingSnapshot.deleteMany({ where: { userId: id } }),
    prisma.scan.deleteMany({ where: { userId: id } }),
    prisma.userPoints.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return reply.send({ message: "Usuário removido com sucesso." });
}

// ─── GET /admin/stats — estatísticas gerais ─────────────────────────────────

export async function getStats(req: FastifyRequest, reply: FastifyReply) {
  const [totalUsers, totalScans, totalPoints, turmas] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.userPoints.aggregate({ _sum: { total: true } }),
    prisma.user.groupBy({ by: ["turma"], _count: true, orderBy: { turma: "asc" } }),
  ]);

  const rolesCount = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  return reply.send({
    totalUsers,
    totalScans,
    totalPoints: totalPoints._sum.total ?? 0,
    turmas: turmas.map((t) => ({ turma: t.turma, count: t._count })),
    roles: rolesCount.map((r) => ({ role: r.role, count: r._count })),
  });
}
