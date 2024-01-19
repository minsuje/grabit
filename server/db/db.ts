import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();
export const db = drizzle(client);

// ex1

// import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';

// const client = postgres({});
// export const db: PostgresJsDatabase = drizzle(client);

// const main = async () => {
//   console.log('runnging...');
// };

// main();

// ex2

// import { migrate } from 'drizzle-orm/';
// import Database from 'better-sqlite3';

// const sqlite = new Database('./db/mysqlite./db');
// export const db: BetterSQLite3Database = drizzle(sqlite);

// migrate(db, { migrationsFolder: './drizzle' });
