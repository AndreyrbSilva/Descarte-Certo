import { FastifyInstance } from "fastify";
import { getUserAchievements } from "../controllers/achievementController";

export async function achievementRoutes(app: FastifyInstance) {
  app.get("/achievements", getUserAchievements);
}
