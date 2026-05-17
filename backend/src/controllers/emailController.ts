import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { authenticator } from "otplib";
import { prisma } from "../lib/prisma";
import { sendEmailCode } from "../lib/mailer";
import { generateCode, codeExpiry } from "./helpers";
import { getUserFromToken } from "../services/authService";

// POST /auth/email/send-code
export async function sendVerifyCode(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });
  if (user.emailVerified) return reply.status(400).send({ error: "E-mail já confirmado." });

  const code = generateCode();
  await prisma.user.update({
    where: { id: userId },
    data:  { emailCode: code, emailCodeExpiry: codeExpiry() },
  });

  await sendEmailCode(user.email, code, "verify");
  return reply.send({ message: "Código enviado para o seu e-mail." });
}

// POST /auth/email/verify
export async function verifyEmail(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { code } = req.body as { code: string };
  if (!code) return reply.status(400).send({ error: "Código obrigatório." });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  if (user.emailCode !== code) return reply.status(400).send({ error: "Código inválido." });
  if (!user.emailCodeExpiry || user.emailCodeExpiry < new Date()) {
    return reply.status(400).send({ error: "Código expirado. Solicite um novo." });
  }

  await prisma.user.update({
    where: { id: userId },
    data:  { emailVerified: true, emailCode: null, emailCodeExpiry: null },
  });

  return reply.send({ message: "E-mail confirmado com sucesso." });
}

// POST /auth/email/change  — body: { newEmail, totpCode? }
export async function changeEmail(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { newEmail, totpCode } = req.body as { newEmail: string; totpCode?: string };
  if (!newEmail || !z.string().email().safeParse(newEmail).success) {
    return reply.status(400).send({ error: "E-mail inválido." });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  // se 2FA ativo, exige o código TOTP
  if (user.twoFactorEnabled) {
    if (!totpCode) return reply.status(400).send({ error: "Código do autenticador obrigatório." });
    if (!user.twoFactorSecret) return reply.status(400).send({ error: "2FA não configurado." });
    const valid = authenticator.verify({ token: totpCode, secret: user.twoFactorSecret });
    if (!valid) return reply.status(400).send({ error: "Código do autenticador inválido." });
  }

  const exists = await prisma.user.findUnique({ where: { email: newEmail } });
  if (exists) return reply.status(400).send({ error: "E-mail já cadastrado." });

  const code = generateCode();
  await prisma.user.update({
    where: { id: userId },
    data:  { emailCode: code, emailCodeExpiry: codeExpiry() },
  });

  await sendEmailCode(newEmail, code, "change-email");

  await prisma.user.update({
    where: { id: userId },
    data:  { emailCode: `${code}::${newEmail}`, emailCodeExpiry: codeExpiry() },
  });

  return reply.send({ message: "Código enviado para o novo e-mail." });
}

// POST /auth/email/change/confirm — body: { code }
export async function confirmChangeEmail(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { code } = req.body as { code: string };
  if (!code) return reply.status(400).send({ error: "Código obrigatório." });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  if (!user.emailCode || !user.emailCodeExpiry) {
    return reply.status(400).send({ error: "Nenhuma alteração pendente." });
  }
  if (user.emailCodeExpiry < new Date()) {
    return reply.status(400).send({ error: "Código expirado. Solicite um novo." });
  }

  const [savedCode, newEmail] = user.emailCode.split("::");
  if (savedCode !== code) return reply.status(400).send({ error: "Código inválido." });
  if (!newEmail)          return reply.status(400).send({ error: "Nenhuma alteração pendente." });

  await prisma.user.update({
    where: { id: userId },
    data:  { email: newEmail, emailVerified: true, emailCode: null, emailCodeExpiry: null },
  });

  return reply.send({ message: "E-mail alterado com sucesso." });
}
