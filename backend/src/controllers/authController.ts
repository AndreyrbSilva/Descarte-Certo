import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

function normalizeTurma(raw: string): string {
  const clean = raw.replace(/[º\s]/g, "");
  const match  = clean.match(/^(\d)([A-Za-z])$/);
  if (!match) return raw;
  return `${match[1]}${match[2].toUpperCase()}`;
}

function isPasswordMedium(pass: string): boolean {
  if (pass.length < 6) return false;
  const hasUpper  = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial= /[^A-Za-z0-9]/.test(pass);
  const score = (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
  return score >= 1;
}

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome não pode conter números."),

  matricula: z
    .string()
    .min(6, "Matrícula deve ter pelo menos 6 dígitos.")
    .regex(/^\d+$/, "Matrícula deve conter apenas números."),

  email: z
    .string()
    .email("E-mail inválido."),

  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres.")
    .refine(isPasswordMedium, "Senha fraca. Use letras maiúsculas, números ou símbolos."),

  turma: z
    .string()
    .transform(normalizeTurma)
    .refine(
      (val) => /^[1-9][A-Z]$/.test(val),
      "Turma inválida. Use o formato: 3B, 3 B, 3º B."
    ),
});

const loginSchema = z.object({
  matricula: z
    .string()
    .min(4, "Informe pelo menos os últimos 4 dígitos da matrícula.")
    .regex(/^\d+$/, "Matrícula deve conter apenas números."),

  password: z
    .string()
    .min(1, "Senha é obrigatória."),
});

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return reply.status(400).send({ error: message });
  }

  const { name, matricula, email, password, turma } = parsed.data;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ matricula }, { email }] },
  });

  if (exists) {
    return reply.status(400).send({ error: "Matrícula ou e-mail já cadastrado." });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, matricula, email, password: hashed, turma },
  });

  return reply.status(201).send({ id: user.id, name: user.name, email: user.email });
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return reply.status(400).send({ error: message });
  }

  const { matricula, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { matricula: { endsWith: matricula } },
  });

  if (!user) {
    return reply.status(401).send({ error: "Matrícula ou senha inválidos." });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return reply.status(401).send({ error: "Matrícula ou senha inválidos." });
  }

  const token = jwt.sign(
    { sub: user.id, matricula: user.matricula },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
}
