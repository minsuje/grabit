"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
exports.default = {
    schema: ['./src/modules/user/schema.ts', './src/modules/account/schema.ts', './src/modules/challenge/schema.ts', './src/modules/alarm/schema.ts', './src/modules/daily_mission/schema.ts'],
    out: './migration',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
//# sourceMappingURL=drizzle.config.js.map