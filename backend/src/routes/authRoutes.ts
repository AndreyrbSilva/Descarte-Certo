import { FastifyInstance } from "fastify";
import {
  register, login, logout, updateAvatar,
  sendVerifyCode, verifyEmail, changeEmail, confirmChangeEmail,
  changePassword,
  setup2FA, verify2FA, disable2FA,
  getMe,
} from "../controllers/authController";
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
  app.post("/auth/logout",  logout);
  app.patch("/auth/avatar", { preHandler: verifyToken }, updateAvatar);
  app.get("/auth/me",       { preHandler: verifyToken }, getMe);

  // email
  app.post("/auth/email/send-code",     { preHandler: verifyToken }, sendVerifyCode);
  app.post("/auth/email/verify",        { preHandler: verifyToken }, verifyEmail);
  app.post("/auth/email/change",        { preHandler: verifyToken }, changeEmail);
  app.post("/auth/email/change/confirm",{ preHandler: verifyToken }, confirmChangeEmail);

  // senha
  app.post("/auth/password/change", { preHandler: verifyToken }, changePassword);

  // 2FA
  app.post("/auth/2fa/setup",   { preHandler: verifyToken }, setup2FA);
  app.post("/auth/2fa/verify",  { preHandler: verifyToken }, verify2FA);
  app.post("/auth/2fa/disable", { preHandler: verifyToken }, disable2FA);
}
