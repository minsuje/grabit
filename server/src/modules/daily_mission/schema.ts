import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core';

type MyObjectType = {
  /* object structure */
  title: string;
  topic: string[];
};

export const dailyMission = pgTable('dailymission', {
  mission_id: serial('mission_id').notNull().primaryKey(),
  mission_content: jsonb('mission_content').$type<MyObjectType[]>().notNull(),
  success_userid_num: integer('success_userid_num').array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
