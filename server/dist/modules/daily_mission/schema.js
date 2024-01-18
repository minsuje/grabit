"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyMission = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.dailyMission = (0, pg_core_1.pgTable)('dailyMission', {
    mission_id: (0, pg_core_1.serial)('mission_id').notNull(),
    mission_content: (0, pg_core_1.varchar)('mission_content', { length: 200 }).notNull(),
    success_userid_num: (0, pg_core_1.integer)('success_userid_num'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
//# sourceMappingURL=schema.js.map