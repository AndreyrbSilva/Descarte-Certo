/**
 * Helpers utilitários para validação e formatação.
 * Funções de autenticação (getUserFromToken, JWT_SECRET) foram movidas para services/authService.ts
 */

export function normalizeTurma(raw: string): string {
  const clean = raw.replace(/[º\s]/g, "");
  const match  = clean.match(/^(\d)([A-Za-z])$/);
  if (!match) return raw;
  return `${match[1]}${match[2].toUpperCase()}`;
}

export function isPasswordMedium(pass: string): boolean {
  if (pass.length < 6) return false;
  const hasUpper   = /[A-Z]/.test(pass);
  const hasNumber  = /[0-9]/.test(pass);
  const hasSpecial = /[^A-Za-z0-9]/.test(pass);
  return (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0) >= 1;
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function codeExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 min
}
