import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  host: process.env.DATABASE_ENDPOINT || "localhost",
  port: parseInt(process.env.DATABASE_PORT, 10) || 3000,
}));