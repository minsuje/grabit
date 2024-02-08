import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

type MyObjectType = {
  /* object structure */
  friendName?: string;
  challengeName?: string;
  inviterName?: string;
  rejectorName?: string;
  requestorName?: string;
};

export const notification = pgTable('notification', {
  notification_id: serial('notification_id').primaryKey(),
  userid_num: integer('userid_num')
    .notNull()
    .references(() => users.userid_num, { onDelete: 'cascade' }),
  reference_id: integer('reference_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  message: jsonb('message').$type<MyObjectType>(),
  is_confirm: boolean('is_confirm').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
