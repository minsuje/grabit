"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication_img_emoticon = exports.authentication = exports.challenge = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.challenge = (0, pg_core_1.pgTable)('challenge', {
    challenge_num: (0, pg_core_1.serial)('challenge_num').primaryKey(),
    challenge_name: (0, pg_core_1.varchar)('challenge_name', { length: 200 }).notNull(),
    topic: (0, pg_core_1.varchar)('topic', { length: 50 }).notNull(),
    challenger_userid_num: (0, pg_core_1.integer)('challenger_userid_num').notNull(),
    goalMoney: (0, pg_core_1.integer)('goalMoney').notNull(),
    deadline: (0, pg_core_1.varchar)('deadline', { length: 20 }).notNull(),
    winner_userid_num: (0, pg_core_1.integer)('winner_userid_num'),
    authentication_term: (0, pg_core_1.integer)('authentication_term').notNull(),
    authentication_time: (0, pg_core_1.varchar)('authentication_time', {
        length: 100,
    }).notNull(),
});
exports.authentication = (0, pg_core_1.pgTable)('authentication', {
    authentication_img_emoticon_id: (0, pg_core_1.serial)('authentication_id').primaryKey(),
    challenge_num: (0, pg_core_1.integer)('challenge_num'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    userid_num: (0, pg_core_1.integer)('userid_num').notNull(),
    authentication_img: (0, pg_core_1.varchar)('authentication_img', { length: 200 }).notNull(),
});
exports.authentication_img_emoticon = (0, pg_core_1.pgTable)('authentication_img_emoticon', {
    authentication_img_emoticon_id: (0, pg_core_1.serial)('authentication_img_emoticon_id').primaryKey(),
    authentication_img_comment_userid_num: (0, pg_core_1.integer)('authentication_img_comment_userid_num').notNull(),
    authentication_img_comment_emoticon: (0, pg_core_1.integer)('authentication_img_comment_emoticon').notNull(),
});
//# sourceMappingURL=schema.js.map