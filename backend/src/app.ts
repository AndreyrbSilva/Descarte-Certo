import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { authRoutes } from "./routes/authRoutes";

export const app = Fastify({ logger: true });

app.register(cors, { origin: "*" });

// 100 req/min global
app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
  errorResponseBuilder: () => ({
    error: "Muitas tentativas. Aguarde um momento e tente novamente.",
  }),
});

app.register(authRoutes);

app.get("/health", async () => ({ status: "ok" }));
