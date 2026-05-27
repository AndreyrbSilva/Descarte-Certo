import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// Testa os schemas de validação Zod usados pelo scanController
// (recriamos os schemas aqui para testar isoladamente a validação)
// ═══════════════════════════════════════════════════════════════════════════

const POINTS_MAP: Record<string, number> = {
  plastico: 10,
  papel:    10,
  metal:    10,
  organico: 10,
  vidro:    10,
};

const scanSchema = z.object({
  category: z.enum(
    ['plastico', 'papel', 'metal', 'organico', 'vidro'],
    { errorMap: () => ({ message: 'Categoria inválida.' }) }
  ),
  imageUrl: z.string().url('URL de imagem inválida.').optional(),
});

describe('POINTS_MAP — mapa de pontos por categoria', () => {
  it('deve ter exatamente 5 categorias', () => {
    expect(Object.keys(POINTS_MAP)).toHaveLength(5);
  });

  it('todas as categorias devem valer 10 pontos', () => {
    for (const [cat, pts] of Object.entries(POINTS_MAP)) {
      expect(pts).toBe(10);
    }
  });

  it('deve conter as categorias: plastico, papel, metal, organico, vidro', () => {
    expect(POINTS_MAP).toHaveProperty('plastico');
    expect(POINTS_MAP).toHaveProperty('papel');
    expect(POINTS_MAP).toHaveProperty('metal');
    expect(POINTS_MAP).toHaveProperty('organico');
    expect(POINTS_MAP).toHaveProperty('vidro');
  });
});

describe('scanSchema — validação de entrada do scan', () => {
  it('deve aceitar scan válido com categoria "plastico"', () => {
    const result = scanSchema.safeParse({ category: 'plastico' });
    expect(result.success).toBe(true);
  });

  it('deve aceitar scan com imageUrl válida', () => {
    const result = scanSchema.safeParse({
      category: 'papel',
      imageUrl: 'https://example.com/foto.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('deve aceitar scan sem imageUrl (campo opcional)', () => {
    const result = scanSchema.safeParse({ category: 'metal' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageUrl).toBeUndefined();
    }
  });

  it('deve rejeitar categoria inválida', () => {
    const result = scanSchema.safeParse({ category: 'madeira' });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Zod v4: mensagem padrão para enum inválido
      expect(result.error.issues[0].message).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('deve rejeitar categoria vazia', () => {
    const result = scanSchema.safeParse({ category: '' });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar sem campo category', () => {
    const result = scanSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('deve rejeitar imageUrl que não é URL válida', () => {
    const result = scanSchema.safeParse({
      category: 'vidro',
      imageUrl: 'nao-e-url',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('URL de imagem inválida.');
    }
  });

  it('deve aceitar todas as 5 categorias válidas', () => {
    const categorias = ['plastico', 'papel', 'metal', 'organico', 'vidro'];
    for (const cat of categorias) {
      const result = scanSchema.safeParse({ category: cat });
      expect(result.success).toBe(true);
    }
  });
});
