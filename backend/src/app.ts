import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/authRoutes";

export const app = Fastify({ logger: true });

app.register(cors, { origin: "*" });
app.register(authRoutes);

app.get("/health", async () => ({ status: "ok" }));