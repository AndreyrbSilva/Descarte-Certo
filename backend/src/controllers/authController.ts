import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

// POST /auth/register
export async function register(req: FastifyRequest, reply: FastifyReply) {
  const { name, matricula, email, password, turma } = req.body as any;

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

// POST /auth/login
export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { matricula, password } = req.body as any;

  const user = await prisma.user.findUnique({ where: { matricula } });

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
