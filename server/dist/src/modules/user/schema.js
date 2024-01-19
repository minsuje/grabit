"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tier = exports.scoreRelations = exports.score = exports.userWithalarmRelations = exports.account = exports.userRelations = exports.users = void 0;
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
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(exports.account),
}));
exports.account = (0, pg_core_1.pgTable)('account', {
    account_id: (0, pg_core_1.serial)('account_id').primaryKey().notNull(),
    transaction_description: (0, pg_core_1.varchar)('transaction_description', {
        length: 100,
    }).notNull(),
    transaction: (0, pg_core_1.varchar)('transaction', { length: 20 }).notNull(),
    transaction_name: (0, pg_core_1.integer)('transaction_name').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    userid_num: (0, pg_core_1.integer)('userid_num').references(() => exports.users.userid_num, {
        onDelete: 'cascade',
    }),
});
exports.userWithalarmRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(schema_1.alarm),
}));
exports.score = (0, pg_core_1.pgTable)('score', {
    score_id: (0, pg_core_1.serial)('score_id').primaryKey(),
    userid_num: (0, pg_core_1.serial)('userid_num').references(() => exports.users.userid_num, {
        onDelete: 'cascade',
    }),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
    score_description: (0, pg_core_1.varchar)('score_description', { length: 100 }),
    score_type: (0, pg_core_1.varchar)('score_type', { length: 30 }),
    score: (0, pg_core_1.integer)('score'),
});
exports.scoreRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    score: one(exports.score),
}));
exports.tier = (0, pg_core_1.pgTable)('tier', {
    tier_id: (0, pg_core_1.serial)('tier_id').primaryKey(),
    tier_name: (0, pg_core_1.varchar)('tier_name', { length: 30 }),
    tier_score: (0, pg_core_1.integer)('tier_score'),
    tier_img: (0, pg_core_1.varchar)('tier_img', { length: 200 }),
});
//# sourceMappingURL=schema.js.map