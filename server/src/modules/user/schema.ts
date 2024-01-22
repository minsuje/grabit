import { relations } from 'drizzle-orm';
import {
  timestamp,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';
import { alarm } from '../alarm/schema';

export const users = pgTable('users', {
  userid_num: serial('userid_num').primaryKey(),
  login_type: varchar('login_type', { length: 50 }).notNull(),
  userid: varchar('userid', { length: 20 }),
  social_userid: varchar('social_userid', { length: 50 }),
  password: varchar('password', { length: 200 }),
  name: varchar('name', { length: 100 }),
  nickname: varchar('nickname', { length: 50 }),
  profile_img: varchar('profile_img', { length: 200 }),
  score_num: integer('score_num').default(0),
  money: integer('money'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(account),
}));

export const account = pgTable('account', {
  account_id: serial('account_id').primaryKey().notNull(),
  transaction_description: varchar('transaction_description', {
    length: 100,
  }).notNull(),
  transaction: varchar('transaction', { length: 20 }).notNull(),
  transaction_name: integer('transaction_name').notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  userid_num: integer('userid_num').references(() => users.userid_num, {
    onDelete: 'cascade',
  }),
});

// export const postsRelations = relations(account, ({ one }) => ({
//     author: one(user, {
//         fields: [account.userid_num],
//         references: [user.userid_num],
//     }),
// }));

export const userWithalarmRelations = relations(users, ({ many }) => ({
  posts: many(alarm),
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

export const tier = pgTable('tier', {
  tier_id: serial('tier_id').primaryKey(),
  tier_name: varchar('tier_name', { length: 30 }),
  tier_score: integer('tier_score'),
  tier_img: varchar('tier_img', { length: 200 }),
});
