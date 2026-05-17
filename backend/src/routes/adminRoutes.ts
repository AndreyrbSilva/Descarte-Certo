import { FastifyInstance } from "fastify";
import { listUsers, changeUserRole, deleteUser, getStats } from "../controllers/adminController";
import { requireAdmin } from "../middlewares/roleMiddleware";

export async function adminRoutes(app: FastifyInstance) {
  // Todas as rotas admin exigem role ADMIN
  app.get("/admin/users",           { preHandler: requireAdmin }, listUsers);
  app.patch("/admin/users/:id/role", { preHandler: requireAdmin }, changeUserRole);
  app.delete("/admin/users/:id",    { preHandler: requireAdmin }, deleteUser);
  app.get("/admin/stats",           { preHandler: requireAdmin }, getStats);
}
