import {
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const challenge = pgTable('challenge', {
  challenge_num: serial('challenge_num').primaryKey(),
  challenge_name: varchar('challenge_name', { length: 200 }).notNull(),
  topic: varchar('topic', { length: 50 }).notNull(),
  challenger_userid_num: integer('challenger_userid_num').notNull(),
  goalMoney: integer('goalMoney').notNull(),
  deadline: varchar('deadline', { length: 20 }).notNull(),
  winner_userid_num: integer('winner_userid_num'),
  authentication_term: integer('authentication_term').notNull(),
  authentication_time: varchar('authentication_time', {
    length: 100,
  }).notNull(),
});

export const authentication = pgTable('authentication', {
  authentication_img_emoticon_id: serial('authentication_id').primaryKey(),
  challenge_num: integer('challenge_num'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  userid_num: integer('userid_num').notNull(),
  authentication_img: varchar('authentication_img', { length: 200 }).notNull(),
});

// export const challengeRelations = relations(challenge, ({ many }) => ({
//   authentication: many(authentication)
// }));

export const authentication_img_emoticon = pgTable(
  'authentication_img_emoticon',
  {
    authentication_img_emoticon_id: serial(
      'authentication_img_emoticon_id',
    ).primaryKey(),
    authentication_img_comment_userid_num: integer(
      'authentication_img_comment_userid_num',
    ).notNull(),
    authentication_img_comment_emoticon: integer(
      'authentication_img_comment_emoticon',
    ).notNull(),
  },
);
