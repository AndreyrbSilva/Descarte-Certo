import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock do Prisma ──────────────────────────────────────────────────────────
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    userPoints: {
      findMany: vi.fn(),
    },
  },
}));

import { getUserRankingPosition } from './rankingService';
import { prisma } from '../lib/prisma';

describe('getUserRankingPosition', () => {
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Ranking por turma ─────────────────────────────────────────────────────

  describe('scope: turma', () => {
    it('deve retornar null se o usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const pos = await getUserRankingPosition(userId, 'turma');
      expect(pos).toBeNull();
    });

    it('deve retornar 1 se o usuário é o primeiro da turma', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ turma: '3B' } as any);

      vi.mocked(prisma.user.findMany).mockResolvedValue([
        { id: 'user-1' },
        { id: 'user-2' },
        { id: 'user-3' },
      ] as any);

      vi.mocked(prisma.userPoints.findMany).mockResolvedValue([
        { userId: 'user-1' }, // 1º lugar
        { userId: 'user-2' }, // 2º
        { userId: 'user-3' }, // 3º
      ] as any);

      const pos = await getUserRankingPosition(userId, 'turma');
      expect(pos).toBe(1);
    });

    it('deve retornar 3 se o usuário é o terceiro da turma', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ turma: '3B' } as any);

      vi.mocked(prisma.user.findMany).mockResolvedValue([
        { id: 'user-1' },
        { id: 'user-2' },
        { id: 'user-3' },
      ] as any);

      vi.mocked(prisma.userPoints.findMany).mockResolvedValue([
        { userId: 'user-2' }, // 1º
        { userId: 'user-3' }, // 2º
        { userId: 'user-1' }, // 3º ← nosso user
      ] as any);

      const pos = await getUserRankingPosition(userId, 'turma');
      expect(pos).toBe(3);
    });

    it('deve retornar null se o usuário não tem pontos registrados', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ turma: '3B' } as any);
      vi.mocked(prisma.user.findMany).mockResolvedValue([{ id: 'user-1' }] as any);
      vi.mocked(prisma.userPoints.findMany).mockResolvedValue([]); // sem pontos

      const pos = await getUserRankingPosition(userId, 'turma');
      expect(pos).toBeNull();
    });
  });

  // ── Ranking por escola ────────────────────────────────────────────────────

  describe('scope: escola', () => {
    it('deve retornar null se o usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const pos = await getUserRankingPosition(userId, 'escola');
      expect(pos).toBeNull();
    });

    it('deve retornar a posição correta no ranking geral da escola', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ turma: '3B' } as any);

      vi.mocked(prisma.userPoints.findMany).mockResolvedValue([
        { userId: 'user-5' }, // 1º
        { userId: 'user-3' }, // 2º
        { userId: 'user-1' }, // 3º ← nosso user
        { userId: 'user-2' }, // 4º
      ] as any);

      const pos = await getUserRankingPosition(userId, 'escola');
      expect(pos).toBe(3);
    });

    it('deve retornar 1 se o usuário lidera o ranking da escola', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ turma: '1A' } as any);

      vi.mocked(prisma.userPoints.findMany).mockResolvedValue([
        { userId: 'user-1' }, // 1º ← nosso user
        { userId: 'user-9' }, // 2º
      ] as any);

      const pos = await getUserRankingPosition(userId, 'escola');
      expect(pos).toBe(1);
    });
  });
});
