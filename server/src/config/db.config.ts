import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
  host: process.env.DATABASE_ENDPOINT || "127.0.0.1",
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));