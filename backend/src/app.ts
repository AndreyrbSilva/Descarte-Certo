import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { authRoutes }    from "./routes/authRoutes";
import { scanRoutes }    from "./routes/scanRoutes";
import { rankingRoutes } from "./routes/rankingRoutes";
import { profileRoutes } from "./routes/profileRoutes";
import { missionRoutes }     from "./routes/missionRoutes";
import { achievementRoutes } from "./routes/achievementRoutes";
import { adminRoutes }       from "./routes/adminRoutes";

export const app = Fastify({ logger: true });

app.register(cors, { origin: "*" });

app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
  errorResponseBuilder: () => ({
    error: "Muitas tentativas. Aguarde um momento e tente novamente.",
  }),
});

app.register(authRoutes);
app.register(scanRoutes);
app.register(rankingRoutes);
app.register(profileRoutes);
app.register(missionRoutes);
app.register(achievementRoutes);
app.register(adminRoutes);

app.get("/health", async () => ({ status: "ok" }));
