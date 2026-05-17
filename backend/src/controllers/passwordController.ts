import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authenticator } from "otplib";
import { prisma } from "../lib/prisma";
import { sendEmailCode } from "../lib/mailer";
import { isPasswordMedium, generateCode, codeExpiry } from "./helpers";
import { getUserFromToken } from "../services/authService";

// ─── password change ─────────────────────────────────────────────────────────

// POST /auth/password/change — body: { currentPassword, newPassword, totpCode? }
export async function changePassword(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const { currentPassword, newPassword, totpCode } = req.body as {
    currentPassword: string; newPassword: string; totpCode?: string;
  };

  if (!currentPassword || !newPassword) {
    return reply.status(400).send({ error: "Senha atual e nova senha são obrigatórias." });
  }

  if (!isPasswordMedium(newPassword)) {
    return reply.status(400).send({ error: "Senha fraca. Use letras maiúsculas, números ou símbolos." });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return reply.status(400).send({ error: "Senha atual incorreta." });

  // 2FA obrigatório para trocar senha
  if (user.twoFactorEnabled) {
    if (!totpCode) return reply.status(400).send({ error: "Código do autenticador obrigatório." });
    if (!user.twoFactorSecret) return reply.status(400).send({ error: "2FA não configurado." });
    const validTotp = authenticator.verify({ token: totpCode, secret: user.twoFactorSecret });
    if (!validTotp) return reply.status(400).send({ error: "Código do autenticador inválido." });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data:  { password: hashed },
  });

  return reply.send({ message: "Senha alterada com sucesso." });
}

// ─── password reset (público — sem auth) ─────────────────────────────────────

// POST /auth/password/reset/request — body: { email }
export async function requestPasswordReset(req: FastifyRequest, reply: FastifyReply) {
  const { email } = req.body as { email: string };
  if (!email || !z.string().email().safeParse(email).success) {
    return reply.status(400).send({ error: "E-mail inválido." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(404).send({ error: "Nenhuma conta encontrada com este e-mail." });
  }

  const code = generateCode();
  await prisma.user.update({
    where: { id: user.id },
    data: { emailCode: `reset::${code}`, emailCodeExpiry: codeExpiry() },
  });

  await sendEmailCode(user.email, code, "reset-password");
  return reply.send({ message: "Código enviado para o seu e-mail." });
}

// POST /auth/password/reset/verify — body: { email, code }
export async function verifyResetCode(req: FastifyRequest, reply: FastifyReply) {
  const { email, code } = req.body as { email: string; code: string };
  if (!email || !code) {
    return reply.status(400).send({ error: "E-mail e código são obrigatórios." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  if (!user.emailCode || !user.emailCode.startsWith("reset::")) {
    return reply.status(400).send({ error: "Nenhuma solicitação de recuperação pendente." });
  }

  const savedCode = user.emailCode.replace("reset::", "");
  if (savedCode !== code) return reply.status(400).send({ error: "Código inválido." });

  if (!user.emailCodeExpiry || user.emailCodeExpiry < new Date()) {
    return reply.status(400).send({ error: "Código expirado. Solicite um novo." });
  }

  return reply.send({ message: "Código verificado com sucesso." });
}

// POST /auth/password/reset/confirm — body: { email, code, newPassword }
export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  const { email, code, newPassword } = req.body as {
    email: string; code: string; newPassword: string;
  };

  if (!email || !code || !newPassword) {
    return reply.status(400).send({ error: "E-mail, código e nova senha são obrigatórios." });
  }

  if (!isPasswordMedium(newPassword)) {
    return reply.status(400).send({ error: "Senha fraca. Use letras maiúsculas, números ou símbolos." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });

  if (!user.emailCode || !user.emailCode.startsWith("reset::")) {
    return reply.status(400).send({ error: "Nenhuma solicitação de recuperação pendente." });
  }

  const savedCode = user.emailCode.replace("reset::", "");
  if (savedCode !== code) return reply.status(400).send({ error: "Código inválido." });

  if (!user.emailCodeExpiry || user.emailCodeExpiry < new Date()) {
    return reply.status(400).send({ error: "Código expirado. Solicite um novo." });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, emailCode: null, emailCodeExpiry: null },
  });

  return reply.send({ message: "Senha redefinida com sucesso." });
}
