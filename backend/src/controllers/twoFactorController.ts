import { FastifyRequest, FastifyReply } from "fastify";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma";
import { getUserFromToken } from "./helpers";

// POST /auth/2fa/setup — gera secret + QR Code
export async function setup2FA(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });
  if (user.twoFactorEnabled) return reply.status(400).send({ error: "2FA já está ativo." });

  const secret  = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, "Descarte Certo", secret);
  const qrCode  = await QRCode.toDataURL(otpauth);

  // salva o secret temporariamente — só confirma após verificação
  await prisma.user.update({
    where: { id: userId },
    data:  { twoFactorSecret: secret },
  });

  return reply.send({ qrCode, secret });
}

// POST /auth/2fa/verify — confirma ativação com código do app
export async function verify2FA(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { totpCode } = req.body as { totpCode: string };
  if (!totpCode) return reply.status(400).send({ error: "Código obrigatório." });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)                 return reply.status(404).send({ error: "Usuário não encontrado." });
  if (!user.twoFactorSecret) return reply.status(400).send({ error: "Inicie a configuração do 2FA primeiro." });

  const valid = authenticator.verify({ token: totpCode, secret: user.twoFactorSecret });
  if (!valid) return reply.status(400).send({ error: "Código inválido. Tente novamente." });

  await prisma.user.update({
    where: { id: userId },
    data:  { twoFactorEnabled: true },
  });

  return reply.send({ message: "2FA ativado com sucesso." });
}

// POST /auth/2fa/disable — body: { totpCode }
export async function disable2FA(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { totpCode } = req.body as { totpCode: string };
  if (!totpCode) return reply.status(400).send({ error: "Código obrigatório." });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)                    return reply.status(404).send({ error: "Usuário não encontrado." });
  if (!user.twoFactorEnabled)   return reply.status(400).send({ error: "2FA não está ativo." });
  if (!user.twoFactorSecret)    return reply.status(400).send({ error: "2FA não configurado." });

  const valid = authenticator.verify({ token: totpCode, secret: user.twoFactorSecret });
  if (!valid) return reply.status(400).send({ error: "Código inválido." });

  await prisma.user.update({
    where: { id: userId },
    data:  { twoFactorEnabled: false, twoFactorSecret: null },
  });

  return reply.send({ message: "2FA desativado com sucesso." });
}
