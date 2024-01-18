import { relations } from 'drizzle-orm';
import { timestamp, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from 'src/modules/user/schema';

export const account = pgTable('account', {
    account_id: serial('account_id').primaryKey().notNull(),
    transaction_description: varchar('transaction_description', { length: 100 }).notNull(),
    transaction: varchar('transaction', { length: 20 }).notNull(),
    transaction_name: integer('transaction_name').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    userid_num: integer('userid_num').references(() => users.userid_num, { onDelete: 'cascade' }),
});

// export const postsRelations = relations(account, ({ one }) => ({
//     author: one(user, {
//         fields: [account.userid_num],
//         references: [user.userid_num],
//     }),
// }));
