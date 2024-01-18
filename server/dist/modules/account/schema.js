"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRelations = exports.account = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../user/schema");
exports.account = (0, pg_core_1.pgTable)('account', {
    account_id: (0, pg_core_1.serial)('account_id').primaryKey().notNull(),
    transaction_description: (0, pg_core_1.varchar)('transaction_description', { length: 100 }).notNull(),
    transaction: (0, pg_core_1.varchar)('transaction', { length: 20 }).notNull(),
    transaction_name: (0, pg_core_1.integer)('transaction_name').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    userid_num: (0, pg_core_1.integer)('userid_num'),
});
exports.postsRelations = (0, drizzle_orm_1.relations)(exports.account, ({ one }) => ({
    author: one(schema_1.user, {
        fields: [exports.account.userid_num],
        references: [schema_1.user.userid_num],
    }),
}));
//# sourceMappingURL=schema.js.map