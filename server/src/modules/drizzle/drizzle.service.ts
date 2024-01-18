import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Injectable } from '@nestjs/common';
import postgres, { Sql } from 'postgres';
import * as process from 'process';
import { sql } from 'drizzle-orm';

@Injectable()
export class DrizzleService {
  private db: PostgresJsDatabase;
  private queryClient: Sql<{}>;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('No environment variable DATABASE_URL');
    }
    this.queryClient = postgres(connectionString);
    this.db = drizzle(this.queryClient);

    await this.clearDb();
  }

  public getDb(): PostgresJsDatabase {
    return this.db;
  }

  public async clearDb(): Promise<void> {
    const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

    const tables = await this.db.execute(query);

    for (let table of tables) {
      const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
      await this.db.execute(query);
    }
  }
}