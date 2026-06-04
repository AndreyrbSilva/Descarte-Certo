import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { getUserFromToken } from "../services/authService";
import { registerPushToken } from "../services/pushNotificationService";

const tokenSchema = z.object({
  token: z.string().min(1, "Token é obrigatório."),
});

// POST /notifications/register
export async function registerToken(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const parsed = tokenSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  await registerPushToken(userId, parsed.data.token);

  return reply.status(200).send({ success: true });
}
