"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRelations = exports.friend = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../user/schema");
exports.friend = (0, pg_core_1.pgTable)('friend', {
    friend_id: (0, pg_core_1.serial)('friend_num').primaryKey(),
    userid_num: (0, pg_core_1.integer)('userid_num')
        .notNull()
        .references(() => schema_1.users.userid_num, {
        onDelete: 'cascade',
    }),
    other_userid_num: (0, pg_core_1.integer)('friend_userid_num')
        .notNull()
        .references(() => schema_1.users.userid_num, {
        onDelete: 'cascade',
    }),
    is_friend: (0, pg_core_1.integer)('is_friend').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.friendRelations = (0, drizzle_orm_1.relations)(schema_1.users, ({ many }) => ({
    user: many(exports.friend),
}));
//# sourceMappingURL=schema.js.map