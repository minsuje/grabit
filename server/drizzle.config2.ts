import 'dotenv/config';

export type { Config } from 'drizzle-kit';

export default {
  shema: ['./src/modules/user/schema.ts', './src/modules/account/schema.ts'],
  out: './drizzle',
  password: '1234',
  host: '43.201.22.60:5432',
  user: 'testuser',
  database: 'grabit',
};
