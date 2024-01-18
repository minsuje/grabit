import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { account } from '../account/schema';
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
    score_num: integer('score_num').notNull(),
    money: integer('money'),
});

export const userRelations = relations(users, ({ many }) => ({
    posts: many(account),
}));

export const userWithalarmRelations = relations(users, ({ many }) => ({
    posts: many(alarm),
}));
