import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

export const notification = pgTable('notification', {
  notification_id: serial('notification_id').notNull(),
  userid_num: integer('userid_num')
    .notNull()
    .references(() => users.userid_num, { onDelete: 'cascade' }),
  reference_id: integer('reference_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  is_confirm: varchar('is_confirm', { length: 10 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .default(new Date())
    .notNull(),
});
