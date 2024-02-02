import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  date,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '../user/schema';
import { json } from 'stream/consumers';

type MyObjectType = {
  /* object structure */
  userid_num: number;
  isAccept: boolean;
  resultConfirm: boolean;
};

export const challenge = pgTable('challenge', {
  challenge_id: serial('challenge_id').primaryKey(),
  userid_num: integer('userid_num').references(() => users.userid_num, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  challenge_name: varchar('challenge_name', { length: 200 }).notNull(),
  is_public: boolean('is_public').notNull().default(false),
  topic: varchar('topic', { length: 50 }).notNull(),
  auth_keyword: varchar('auth_keyword').notNull(),
  challenger_userid_num: jsonb('challenger_userid_num')
    .$type<MyObjectType[]>()
    .notNull(),
  goal_money: integer('goal_money').notNull(),
  term: integer('term').notNull(),
  winner_userid_num: integer('winner_userid_num').array(),
  authentication_start_date: timestamp('authentication_start_date', {
    withTimezone: true,
  }).notNull(),
  authentication_end_date: timestamp('authentication_end_date', {
    withTimezone: true,
  }).notNull(),
  authentication_start_time: integer('authentication_start_time').notNull(),
  authentication_end_time: integer('authentication_end_time').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const challengeRelations = relations(users, ({ many }) => ({
  posts: many(challenge),
}));

export const authentication = pgTable('authentication', {
  authentication_id: serial('authentication_id').primaryKey(),
  challenge_id: integer('challenge_id').references(
    () => challenge.challenge_id,
    { onDelete: 'cascade', onUpdate: 'cascade' },
  ),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userid_num: integer('userid_num').notNull(),
  authentication_img: varchar('authentication_img', {
    length: 200,
  }).notNull(),
  authentication_status: boolean('authentication_status').notNull(),
});

export const authenticationRelations = relations(challenge, ({ many }) => ({
  posts: many(authentication),
}));

export const authentication_img_emoticon = pgTable(
  'authentication_img_emoticon',
  {
    authentication_img_emoticon_id: serial(
      'authentication_img_emoticon_id',
    ).primaryKey(),
    authentication_id: integer('authentication_id').references(
      () => authentication.authentication_id,
      { onDelete: 'cascade', onUpdate: 'cascade' },
    ),
    authentication_img_comment_userid_num: integer(
      'authentication_img_comment_userid_num',
    ).notNull(),
    authentication_img_comment_emoticon: integer(
      'authentication_img_comment_emoticon',
    ).notNull(),
    created_at: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const authenticationEmoticonRelations = relations(
  authentication,
  ({ many }) => ({
    posts: many(authentication_img_emoticon),
  }),
);
