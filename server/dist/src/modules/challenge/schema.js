"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationEmoticonRelations = exports.authentication_img_emoticon = exports.authenticationRelations = exports.authentication = exports.challengeRelations = exports.challenge = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../user/schema");
exports.challenge = (0, pg_core_1.pgTable)('challenge', {
    challenge_id: (0, pg_core_1.serial)('challenge_id').primaryKey(),
    userid_num: (0, pg_core_1.integer)('userid_num').references(() => schema_1.users.userid_num, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    }),
    challenge_name: (0, pg_core_1.varchar)('challenge_name', { length: 200 }).notNull(),
    topic: (0, pg_core_1.varchar)('topic', { length: 50 }).notNull(),
    challenger_userid_num: (0, pg_core_1.integer)('challenger_userid_num').array().notNull(),
    goal_money: (0, pg_core_1.integer)('goal_money').notNull(),
    deadline: (0, pg_core_1.varchar)('deadline', { length: 20 }).notNull(),
    winner_userid_num: (0, pg_core_1.integer)('winner_userid_num').array(),
    authentication_term: (0, pg_core_1.integer)('authentication_term').notNull(),
    authentication_time: (0, pg_core_1.varchar)('authentication_time', {
        length: 100,
    }).notNull(),
});
exports.challengeRelations = (0, drizzle_orm_1.relations)(schema_1.users, ({ many }) => ({
    posts: many(exports.challenge),
}));
exports.authentication = (0, pg_core_1.pgTable)('authentication', {
    authentication_id: (0, pg_core_1.serial)('authentication_id').primaryKey(),
    challenge_id: (0, pg_core_1.integer)('challenge_id').references(() => exports.challenge.challenge_id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    userid_num: (0, pg_core_1.integer)('userid_num').notNull(),
    authentication_img: (0, pg_core_1.varchar)('authentication_img', {
        length: 200,
    }).notNull(),
});
exports.authenticationRelations = (0, drizzle_orm_1.relations)(exports.challenge, ({ many }) => ({
    posts: many(exports.authentication),
}));
exports.authentication_img_emoticon = (0, pg_core_1.pgTable)('authentication_img_emoticon', {
    authentication_img_emoticon_id: (0, pg_core_1.serial)('authentication_img_emoticon_id').primaryKey(),
    authentication_id: (0, pg_core_1.integer)('authentication_id').references(() => exports.authentication.authentication_id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    authentication_img_comment_userid_num: (0, pg_core_1.integer)('authentication_img_comment_userid_num').notNull(),
    authentication_img_comment_emoticon: (0, pg_core_1.integer)('authentication_img_comment_emoticon').notNull(),
});
exports.authenticationEmoticonRelations = (0, drizzle_orm_1.relations)(exports.authentication, ({ many }) => ({
    posts: many(exports.authentication_img_emoticon),
}));
//# sourceMappingURL=schema.js.map