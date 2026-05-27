import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock do Prisma ──────────────────────────────────────────────────────────
// Mocka o módulo inteiro da lib/prisma antes de importar o service
vi.mock('../lib/prisma', () => ({
  prisma: {
    scan: {
      findMany: vi.fn(),
    },
  },
}));

import { computeStreak } from './streakService';
import { prisma } from '../lib/prisma';

// Helper: cria datas de scan para dias consecutivos até hoje
function createScanDates(daysBack: number[]): { createdAt: Date }[] {
  return daysBack.map((d) => ({
    createdAt: new Date(Date.now() - d * 86_400_000),
  }));
}

// Helper: cria data para um dia específico no passado
function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000);
}

describe('computeStreak', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 0 se o usuário não tem nenhum scan', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue([]);

    const streak = await computeStreak(userId);
    expect(streak).toBe(0);
  });

  it('deve retornar 1 se o usuário escaneou apenas hoje', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([0]) // hoje
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(1);
  });

  it('deve retornar 3 para 3 dias consecutivos (hoje, ontem, anteontem)', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([0, 1, 2]) // hoje, ontem, anteontem
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(3);
  });

  it('deve retornar 1 se ontem teve scan mas hoje não (streak conta a partir de ontem)', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([1]) // apenas ontem
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(1);
  });

  it('deve retornar 0 se último scan foi há 2 dias (nem hoje nem ontem)', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([2]) // anteontem apenas
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(0);
  });

  it('deve contar múltiplos scans no mesmo dia como 1 dia', async () => {
    const today = new Date();
    vi.mocked(prisma.scan.findMany).mockResolvedValue([
      { createdAt: today },
      { createdAt: today },
      { createdAt: today },
    ]);

    const streak = await computeStreak(userId);
    expect(streak).toBe(1);
  });

  it('deve interromper streak quando há um dia sem scan', async () => {
    // hoje, ontem, GAP, 3 dias atrás
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([0, 1, 3]) // faltou o dia 2
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(2); // apenas hoje + ontem
  });

  it('deve verificar que prisma.scan.findMany é chamado com os parâmetros corretos', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue([]);

    await computeStreak(userId);

    expect(prisma.scan.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
  });

  it('deve retornar 7 para uma semana completa de streaks', async () => {
    vi.mocked(prisma.scan.findMany).mockResolvedValue(
      createScanDates([0, 1, 2, 3, 4, 5, 6])
    );

    const streak = await computeStreak(userId);
    expect(streak).toBe(7);
  });
});
