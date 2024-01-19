"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRelations = exports.user = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../account/schema");
exports.user = (0, pg_core_1.pgTable)('user', {
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
exports.userRelations = (0, drizzle_orm_1.relations)(exports.user, ({ many }) => ({
    posts: many(schema_1.account),
}));
//# sourceMappingURL=schema.js.map