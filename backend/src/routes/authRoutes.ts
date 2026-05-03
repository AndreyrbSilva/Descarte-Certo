import { FastifyInstance } from "fastify";
import { register, login, logout, updateAvatar } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", register);

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

  app.patch("/auth/avatar", { preHandler: verifyToken }, updateAvatar);
}
