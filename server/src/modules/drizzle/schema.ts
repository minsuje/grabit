
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  userid_num: serial('userid_num').primaryKey(),
  login_type: varchar('login_type', { length: 50 }).notNull(),
  userid: varchar('userid', {length: 20}),
  social_userid: varchar('social_userid', {length: 50}),
  password: varchar('password', {length: 200}),
  name: varchar('name', {length: 100}),
  nickname: varchar('nickname', {length: 50}),
  profile_img: varchar('profile_img', {length: 200}),
  score_num: integer('score_num'),
  money: integer('money'),
});