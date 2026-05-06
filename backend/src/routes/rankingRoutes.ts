import { FastifyInstance } from "fastify";
import {
  getMyRanking,
  getTurmaRanking,
  getEscolaRanking,
} from "../controllers/rankingController";

export async function rankingRoutes(app: FastifyInstance) {
  app.get("/ranking/me",     getMyRanking);
  app.get("/ranking/turma",  getTurmaRanking);
  app.get("/ranking/escola", getEscolaRanking);
}
