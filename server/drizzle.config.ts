import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default {
  schema: [
    './src/modules/user/schema.ts',
    './src/modules/account/schema.ts',
    './src/modules/challenge/schema.ts',
    './src/modules/notification/schema.ts',
    './src/modules/daily_mission/schema.ts',
    './src/modules/friend/schema.ts',
  ],
  out: './migration',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
