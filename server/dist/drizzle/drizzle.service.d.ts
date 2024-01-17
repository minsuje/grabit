import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
export declare class DrizzleService {
    private db;
    private queryClient;
    constructor();
    private connect;
    getDb(): PostgresJsDatabase;
    clearDb(): Promise<void>;
}
