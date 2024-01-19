"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWithalarmRelations = exports.account = exports.userRelations = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../alarm/schema");
exports.users = (0, pg_core_1.pgTable)('users', {
    userid_num: (0, pg_core_1.serial)('userid_num').primaryKey(),
    login_type: (0, pg_core_1.varchar)('login_type', { length: 50 }).notNull(),
    userid: (0, pg_core_1.varchar)('userid', { length: 20 }),
    social_userid: (0, pg_core_1.varchar)('social_userid', { length: 50 }),
    password: (0, pg_core_1.varchar)('password', { length: 200 }),
    name: (0, pg_core_1.varchar)('name', { length: 100 }),
    nickname: (0, pg_core_1.varchar)('nickname', { length: 50 }),
    profile_img: (0, pg_core_1.varchar)('profile_img', { length: 200 }),
    score_num: (0, pg_core_1.integer)('score_num').notNull(),
    money: (0, pg_core_1.integer)('money'),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(exports.account),
}));
exports.account = (0, pg_core_1.pgTable)('account', {
    account_id: (0, pg_core_1.serial)('account_id').primaryKey().notNull(),
    transaction_description: (0, pg_core_1.varchar)('transaction_description', { length: 100 }).notNull(),
    transaction: (0, pg_core_1.varchar)('transaction', { length: 20 }).notNull(),
    transaction_name: (0, pg_core_1.integer)('transaction_name').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    userid_num: (0, pg_core_1.integer)('userid_num').references(() => exports.users.userid_num, { onDelete: 'cascade' }),
});
exports.userWithalarmRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(schema_1.alarm),
}));
//# sourceMappingURL=schema.js.map