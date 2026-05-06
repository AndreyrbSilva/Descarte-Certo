import { FastifyInstance } from "fastify";
import { getPublicProfile } from "../controllers/profileController";

export async function profileRoutes(app: FastifyInstance) {
  app.get("/profile/:userId", getPublicProfile);
}
