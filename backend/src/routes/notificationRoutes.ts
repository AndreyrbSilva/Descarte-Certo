import { FastifyInstance } from "fastify";
import { registerToken } from "../controllers/notificationController";

export async function notificationRoutes(app: FastifyInstance) {
  app.post("/notifications/register", registerToken);
}
