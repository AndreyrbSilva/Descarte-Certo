import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../lib/blacklist";

export const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

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

export async function getUserFromToken(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    reply.status(401).send({ error: "Token não fornecido." });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    reply.status(401).send({ error: "Token inválido ou expirado." });
    return null;
  }

  const blocked = await isBlacklisted(token);
  if (blocked) {
    reply.status(401).send({ error: "Sessão encerrada. Faça login novamente." });
    return null;
  }

  const payload = jwt.decode(token) as { sub: string };
  return payload.sub;
}
