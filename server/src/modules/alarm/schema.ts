import { timestamp, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { users } from '../user/schema';

export const alarm = pgTable('alarm', {
    alarm_id: serial('alarm_id').notNull(),
    userid_num: integer('userid_num')
        .notNull()
        .references(() => users.userid_num, { onDelete: 'cascade' }),
    challenge_num: integer('challenge_num').notNull(),
});
