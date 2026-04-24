import Fastify from "fastify";
import cors from "@fastify/cors";

export const app = Fastify({ logger: true });

app.register(cors, {
  origin: "*",
});

app.get("/health", async () => {
  return { status: "ok" };
});