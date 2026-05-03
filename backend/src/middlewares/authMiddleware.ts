import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../lib/blacklist";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return reply.status(401).send({ error: "Token inválido ou expirado." });
  }

  const blocked = await isBlacklisted(token);
  if (blocked) {
    return reply.status(401).send({ error: "Sessão encerrada. Faça login novamente." });
  }

  (req as any).userId = decoded.sub;
}
