import { describe, it, expect } from 'vitest';
import { normalizeTurma, isPasswordMedium, generateCode, codeExpiry } from './helpers';

// ═══════════════════════════════════════════════════════════════════════════
// normalizeTurma — normaliza formatos de turma para o padrão "3B"
// ═══════════════════════════════════════════════════════════════════════════

describe('normalizeTurma', () => {
  it('deve retornar "3B" quando receber "3B"', () => {
    expect(normalizeTurma('3B')).toBe('3B');
  });

  it('deve converter minúscula para maiúscula: "3b" → "3B"', () => {
    expect(normalizeTurma('3b')).toBe('3B');
  });

  it('deve remover "º" e espaços: "3º B" → "3B"', () => {
    expect(normalizeTurma('3º B')).toBe('3B');
  });

  it('deve remover apenas "º": "3ºB" → "3B"', () => {
    expect(normalizeTurma('3ºB')).toBe('3B');
  });

  it('deve lidar com espaço sem º: "3 B" → "3B"', () => {
    expect(normalizeTurma('3 B')).toBe('3B');
  });

  it('deve lidar com turma 1A', () => {
    expect(normalizeTurma('1a')).toBe('1A');
  });

  it('deve retornar raw se formato inválido (ex: "turmaX")', () => {
    expect(normalizeTurma('turmaX')).toBe('turmaX');
  });

  it('deve retornar raw se vazio', () => {
    expect(normalizeTurma('')).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// isPasswordMedium — valida força mínima da senha
// ═══════════════════════════════════════════════════════════════════════════

describe('isPasswordMedium', () => {
  it('deve rejeitar senha com menos de 6 caracteres', () => {
    expect(isPasswordMedium('Ab1')).toBe(false);
  });

  it('deve rejeitar senha de 6 chars somente minúsculas (sem upper/número/especial)', () => {
    expect(isPasswordMedium('abcdef')).toBe(false);
  });

  it('deve aceitar senha com 6+ chars e pelo menos 1 maiúscula', () => {
    expect(isPasswordMedium('Abcdef')).toBe(true);
  });

  it('deve aceitar senha com 6+ chars e pelo menos 1 número', () => {
    expect(isPasswordMedium('abcde1')).toBe(true);
  });

  it('deve aceitar senha com 6+ chars e pelo menos 1 caractere especial', () => {
    expect(isPasswordMedium('abcde!')).toBe(true);
  });

  it('deve aceitar senha forte com todos os critérios', () => {
    expect(isPasswordMedium('Abc123!')).toBe(true);
  });

  it('deve rejeitar string vazia', () => {
    expect(isPasswordMedium('')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// generateCode — gera código de 6 dígitos
// ═══════════════════════════════════════════════════════════════════════════

describe('generateCode', () => {
  it('deve gerar string de exatamente 6 caracteres', () => {
    const code = generateCode();
    expect(code).toHaveLength(6);
  });

  it('deve gerar apenas dígitos numéricos', () => {
    const code = generateCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('deve gerar valor entre 100000 e 999999', () => {
    for (let i = 0; i < 100; i++) {
      const num = Number(generateCode());
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThanOrEqual(999999);
    }
  });

  it('deve gerar códigos diferentes na maioria das vezes', () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// codeExpiry — retorna data 15 minutos no futuro
// ═══════════════════════════════════════════════════════════════════════════

describe('codeExpiry', () => {
  it('deve retornar uma instância de Date', () => {
    expect(codeExpiry()).toBeInstanceOf(Date);
  });

  it('deve ser aproximadamente 15 minutos no futuro', () => {
    const before = Date.now();
    const expiry = codeExpiry();
    const after = Date.now();

    const fifteenMin = 15 * 60 * 1000;
    expect(expiry.getTime()).toBeGreaterThanOrEqual(before + fifteenMin - 100);
    expect(expiry.getTime()).toBeLessThanOrEqual(after + fifteenMin + 100);
  });

  it('deve ser no futuro (depois de agora)', () => {
    expect(codeExpiry().getTime()).toBeGreaterThan(Date.now());
  });
});
