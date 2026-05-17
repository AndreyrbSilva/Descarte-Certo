import { prisma } from "../lib/prisma";

/**
 * Calcula a sequência (streak) de dias consecutivos com escaneamentos.
 * Considera hoje e ontem como possíveis dias iniciais.
 */
export async function computeStreak(userId: string): Promise<number> {
  const scans = await prisma.scan.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    select:  { createdAt: true },
  });

  if (scans.length === 0) return 0;

  const toDateStr  = (d: Date) => d.toISOString().slice(0, 10);
  const activeDays = new Set(scans.map((s) => toDateStr(s.createdAt)));
  const today      = toDateStr(new Date());
  const yesterday  = toDateStr(new Date(Date.now() - 86_400_000));

  const startDay = activeDays.has(today)
    ? today
    : activeDays.has(yesterday)
    ? yesterday
    : null;

  if (!startDay) return 0;

  let streak  = 0;
  let current = new Date(startDay + "T12:00:00Z");

  while (activeDays.has(toDateStr(current))) {
    streak++;
    current = new Date(current.getTime() - 86_400_000);
  }

  return streak;
}
