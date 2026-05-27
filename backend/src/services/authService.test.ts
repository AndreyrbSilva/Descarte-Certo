import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// ── Mock do módulo de blacklist ─────────────────────────────────────────────
vi.mock('../lib/blacklist', () => ({
  isBlacklisted: vi.fn(),
}));

// ── Mock do Prisma (necessário pois blacklist importa prisma) ───────────────
vi.mock('../lib/prisma', () => ({
  prisma: {},
}));

import { getUserFromToken, JWT_SECRET } from './authService';
import { isBlacklisted } from '../lib/blacklist';

// Helper para criar requests e replies fake do Fastify
function createMockRequest(authHeader?: string) {
  return {
    headers: {
      authorization: authHeader,
    },
  } as any;
}

function createMockReply() {
  const reply: any = {
    statusCode: 200,
    body: null,
    status(code: number) {
      reply.statusCode = code;
      return reply;
    },
    send(body: any) {
      reply.body = body;
      return reply;
    },
  };
  return reply;
}

describe('getUserFromToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar null e status 401 se não há header Authorization', async () => {
    const req = createMockRequest(undefined);
    const reply = createMockReply();

    const result = await getUserFromToken(req, reply);

    expect(result).toBeNull();
    expect(reply.statusCode).toBe(401);
    expect(reply.body.error).toBe('Token não fornecido.');
  });

  it('deve retornar null se o header não começa com "Bearer "', async () => {
    const req = createMockRequest('Basic abc123');
    const reply = createMockReply();

    const result = await getUserFromToken(req, reply);

    expect(result).toBeNull();
    expect(reply.statusCode).toBe(401);
  });

  it('deve retornar null se o token é inválido/expirado', async () => {
    const req = createMockRequest('Bearer token.invalido.aqui');
    const reply = createMockReply();

    const result = await getUserFromToken(req, reply);

    expect(result).toBeNull();
    expect(reply.statusCode).toBe(401);
    expect(reply.body.error).toBe('Token inválido ou expirado.');
  });

  it('deve retornar null se o token está na blacklist', async () => {
    const token = jwt.sign({ sub: 'user-123' }, JWT_SECRET, { expiresIn: '1h' });
    const req = createMockRequest(`Bearer ${token}`);
    const reply = createMockReply();

    vi.mocked(isBlacklisted).mockResolvedValue(true);

    const result = await getUserFromToken(req, reply);

    expect(result).toBeNull();
    expect(reply.statusCode).toBe(401);
    expect(reply.body.error).toBe('Sessão encerrada. Faça login novamente.');
  });

  it('deve retornar o userId para um token válido e não-blacklistado', async () => {
    const token = jwt.sign({ sub: 'user-abc-123' }, JWT_SECRET, { expiresIn: '1h' });
    const req = createMockRequest(`Bearer ${token}`);
    const reply = createMockReply();

    vi.mocked(isBlacklisted).mockResolvedValue(false);

    const result = await getUserFromToken(req, reply);

    expect(result).toBe('user-abc-123');
  });

  it('deve chamar isBlacklisted com o token correto', async () => {
    const token = jwt.sign({ sub: 'user-xyz' }, JWT_SECRET, { expiresIn: '1h' });
    const req = createMockRequest(`Bearer ${token}`);
    const reply = createMockReply();

    vi.mocked(isBlacklisted).mockResolvedValue(false);

    await getUserFromToken(req, reply);

    expect(isBlacklisted).toHaveBeenCalledWith(token);
  });
});

describe('JWT_SECRET', () => {
  it('deve existir e ser uma string', () => {
    expect(typeof JWT_SECRET).toBe('string');
    expect(JWT_SECRET.length).toBeGreaterThan(0);
  });
});
