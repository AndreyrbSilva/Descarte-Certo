import { FastifyInstance } from "fastify";
import { getDailyMission } from "../controllers/missionController";

export async function missionRoutes(app: FastifyInstance) {
  app.get("/missions/daily", getDailyMission);
}
