import { FastifyInstance } from "fastify";
import { getMyRanking } from "../controllers/rankingController";

export async function rankingRoutes(app: FastifyInstance) {
  app.get("/ranking/me", getMyRanking);
}
