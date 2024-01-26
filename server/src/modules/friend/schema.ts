import { is, relations } from 'drizzle-orm';
import {
  timestamp,
  integer,
  pgTable,
  serial,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

export const friend = pgTable('friend', {
  friend_id: serial('friend_num').primaryKey(),
  userid_num: integer('userid_num')
    .notNull()
    .references(() => users.userid_num, {
      onDelete: 'cascade',
    }),
  other_userid_num: integer('other_userid_num')
    .notNull()
    .references(() => users.userid_num, {
      onDelete: 'cascade',
    }),
  is_friend: boolean('is_friend').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const friendRelations = relations(users, ({ many }) => ({
  user: many(friend),
}));
