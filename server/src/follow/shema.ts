import { timestamp, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const follow = pgTable('follow', {
    id: serial('id').primaryKey().notNull(),
    userid_num: serial('userid_num').notNull(),
    other_user_num: integer('other_user_num').notNull(),
});
