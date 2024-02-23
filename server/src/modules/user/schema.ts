import { relations } from 'drizzle-orm';
import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
  text,
  boolean,
} from 'drizzle-orm/pg-core';
import { notification } from '../notification/schema';

export const users = pgTable('users', {
  userid_num: serial('userid_num').primaryKey(),
  login_type: varchar('login_type', { length: 50 }).notNull(),
  userid: varchar('userid', { length: 100 }),
  password: varchar('password', { length: 200 }),
  name: varchar('name', { length: 100 }),
  nickname: varchar('nickname', { length: 50 }),
  profile_img: varchar('profile_img', { length: 200 }),
  score_num: integer('score_num').default(0),
  carrot: integer('carrot').default(5000),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  refreshToken: text('refreshToken').array(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(account),
}));

export const account = pgTable('account', {
  account_id: serial('account_id').primaryKey().notNull(),
  transaction_description: varchar('transaction_description', {
    length: 100,
  }).notNull(),
  transaction_type: varchar('transaction_type', { length: 30 }).notNull(),
  transaction_amount: integer('transaction_amount').notNull(),
  status: boolean('status').notNull(),
  account_info: varchar('account_info', { length: 200 }).array(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  userid_num: integer('userid_num').references(() => users.userid_num, {
    onDelete: 'cascade',
  }),
});

export const userWithNotificationRelations = relations(users, ({ many }) => ({
  posts: many(notification),
}));

export const score = pgTable('score', {
  score_id: serial('score_id').primaryKey(),
  userid_num: serial('userid_num').references(() => users.userid_num, {
    onDelete: 'cascade',
  }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  score_description: varchar('score_description', { length: 100 }),
  score_type: varchar('score_type', { length: 30 }),
  score: integer('score'),
});

export const scoreRelations = relations(users, ({ one }) => ({
  score: one(score),
}));
