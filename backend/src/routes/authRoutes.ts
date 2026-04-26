import { FastifyInstance } from "fastify";
import { register, login, logout } from "../controllers/authController";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", register);

  // 5 tentativas/min por IP
  app.post("/auth/login", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
        errorResponseBuilder: () => ({
          error: "Muitas tentativas de login. Aguarde 1 minuto e tente novamente.",
        }),
      },
    },
  }, login);

  app.post("/auth/logout", logout);
}
