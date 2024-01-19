"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.follow = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.follow = (0, pg_core_1.pgTable)('follow', {
    id: (0, pg_core_1.serial)('id').primaryKey().notNull(),
    userid_num: (0, pg_core_1.serial)('userid_num').notNull(),
    other_user_num: (0, pg_core_1.integer)('other_user_num').notNull(),
});
//# sourceMappingURL=shema.js.map