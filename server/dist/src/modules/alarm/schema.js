"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alarm = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("../user/schema");
exports.alarm = (0, pg_core_1.pgTable)('alarm', {
    alarm_id: (0, pg_core_1.serial)('alarm_id').notNull(),
    userid_num: (0, pg_core_1.integer)('userid_num')
        .notNull()
        .references(() => schema_1.users.userid_num, { onDelete: 'cascade' }),
    challenge_num: (0, pg_core_1.integer)('challenge_num').notNull(),
});
//# sourceMappingURL=schema.js.map