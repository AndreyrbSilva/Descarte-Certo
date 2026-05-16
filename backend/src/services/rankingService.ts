import { prisma } from "../lib/prisma";

/**
 * Calcula a posição do usuário no ranking (turma ou escola).
 * Retorna null se o usuário não tiver pontos registrados.
 */
export async function getUserRankingPosition(
  userId: string,
  scope: "turma" | "escola"
): Promise<number | null> {
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
