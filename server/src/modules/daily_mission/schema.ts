import { timestamp, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const dailyMission = pgTable('dailyMission', {
    mission_id: serial('mission_id').notNull(),
    mission_content: varchar('mission_content', { length: 200 }).notNull(),
    success_userid_num: integer('success_userid_num'),
    createdAt: timestamp('created_at').defaultNow(),
});
