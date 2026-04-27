import { FastifyInstance } from "fastify";
import { registerScan, getScanHistory, getUserPoints } from "../controllers/scanController";

export async function scanRoutes(app: FastifyInstance) {
  app.post("/scan",          registerScan);
  app.get("/scan/history",   getScanHistory);
  app.get("/scan/points",    getUserPoints);
}
