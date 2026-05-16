import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { encrypt, decrypt } from "../lib/crypto";
import { blacklistToken, isBlacklisted } from "../lib/blacklist";
import { normalizeTurma, isPasswordMedium } from "./helpers";
import { JWT_SECRET, getUserFromToken } from "../services/authService";

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
