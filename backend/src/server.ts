import { app } from "./app";

// Prevent silent crashes on Railway
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const PORT = Number(process.env.PORT) || 3333;

console.log(`[startup] PORT=${PORT}, DATABASE_URL=${process.env.DATABASE_URL ? "SET" : "MISSING"}, AES_SECRET=${process.env.AES_SECRET ? "SET" : "MISSING"}, JWT_SECRET=${process.env.JWT_SECRET ? "SET" : "MISSING"}`);

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});