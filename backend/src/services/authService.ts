import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../lib/blacklist";

export const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

/**
 * Extrai o userId do token JWT presente no header Authorization.
 * Valida assinatura, expiração e blacklist.
 * Retorna null (e envia resposta de erro) se inválido.
 */
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
