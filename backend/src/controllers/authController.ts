import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma";
import { encrypt, decrypt } from "../lib/crypto";
import { blacklistToken, isBlacklisted } from "../lib/blacklist";
import { sendEmailCode } from "../lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

// ─── helpers ────────────────────────────────────────────────────────────────

function normalizeTurma(raw: string): string {
  const clean = raw.replace(/[º\s]/g, "");
  const match  = clean.match(/^(\d)([A-Za-z])$/);
  if (!match) return raw;
  return `${match[1]}${match[2].toUpperCase()}`;
}

function isPasswordMedium(pass: string): boolean {
  if (pass.length < 6) return false;
  const hasUpper   = /[A-Z]/.test(pass);
  const hasNumber  = /[0-9]/.test(pass);
  const hasSpecial = /[^A-Za-z0-9]/.test(pass);
  return (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0) >= 1;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function codeExpiry(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 min
}

async function getUserFromToken(req: FastifyRequest, reply: FastifyReply) {
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

// ─── schemas ────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome não pode conter números."),
  matricula: z
    .string()
    .min(6, "Matrícula deve ter pelo menos 6 dígitos.")
    .regex(/^\d+$/, "Matrícula deve conter apenas números."),
  email:    z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres.")
    .refine(isPasswordMedium, "Senha fraca. Use letras maiúsculas, números ou símbolos."),
  turma: z
    .string()
    .transform(normalizeTurma)
    .refine((val) => /^[1-9][A-Z]$/.test(val), "Turma inválida. Use o formato: 3B, 3 B, 3º B."),
});

const loginSchema = z.object({
  matricula: z
    .string()
    .min(4, "Informe pelo menos os últimos 4 dígitos da matrícula.")
    .regex(/^\d+$/, "Matrícula deve conter apenas números."),
  password: z.string().min(1, "Senha é obrigatória."),
});

const avatarSchema = z.object({
  avatarUrl: z.string().url("URL inválida."),
});

// ─── auth base ───────────────────────────────────────────────────────────────

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const { name, matricula, email, password, turma } = parsed.data;

  const allUsers  = await prisma.user.findMany({ select: { matricula: true, email: true } });
  const duplicate = allUsers.some((u) => {
    try { return decrypt(u.matricula) === matricula || u.email === email; }
    catch { return false; }
  });

  if (duplicate) {
    return reply.status(400).send({ error: "Matrícula ou e-mail já cadastrado." });
  }

  const hashed          = await bcrypt.hash(password, 10);
  const encryptedMatric = encrypt(matricula);

  const user = await prisma.user.create({
    data: { name, matricula: encryptedMatric, email, password: hashed, turma },
  });

  return reply.status(201).send({ id: user.id, name: user.name, email: user.email });
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const { matricula, password } = parsed.data;

  const allUsers = await prisma.user.findMany();
  const user     = allUsers.find((u) => {
    try { return decrypt(u.matricula).endsWith(matricula); }
    catch { return false; }
  });

  if (!user) return reply.status(401).send({ error: "Matrícula ou senha inválidos." });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)  return reply.status(401).send({ error: "Matrícula ou senha inválidos." });

  const token = jwt.sign(
    { sub: user.id, matricula: user.matricula },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return reply.send({
    token,
    user: {
      id:               user.id,
      name:             user.name,
      email:            user.email,
      turma:            user.turma,
      avatarUrl:        user.avatarUrl,
      emailVerified:    user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  });
}

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  try { jwt.verify(token, JWT_SECRET); } catch {
    return reply.send({ message: "Logout realizado com sucesso." });
  }

  const blocked = await isBlacklisted(token);
  if (blocked) return reply.status(401).send({ error: "Sessão encerrada. Faça login novamente." });

  await blacklistToken(token);
  return reply.send({ message: "Logout realizado com sucesso." });
}

export async function updateAvatar(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req as any).userId;

  const parsed = avatarSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data:  { avatarUrl: parsed.data.avatarUrl },
  });

  return reply.send({ avatarUrl: user.avatarUrl });
}

// ─── email verification ──────────────────────────────────────────────────────

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

// ─── 2FA ─────────────────────────────────────────────────────────────────────

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

// GET /auth/me — retorna dados atuais do usuário
export async function getMe(req: FastifyRequest, reply: FastifyReply) {
  const userId = await getUserFromToken(req, reply);
  if (!userId) return;

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      id: true, name: true, email: true, turma: true,
      avatarUrl: true, emailVerified: true, twoFactorEnabled: true,
    },
  });

  if (!user) return reply.status(404).send({ error: "Usuário não encontrado." });
  return reply.send({ user });
}
