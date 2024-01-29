import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export const dailyMission = pgTable('dailymission', {
  mission_id: serial('mission_id').notNull().primaryKey(),
  mission_content: varchar('mission_content', { length: 200 }).notNull(),
  success_userid_num: integer('success_userid_num').array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
