"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    shema: ['./src/modules/user/schema.ts', './src/modules/account/schema.ts'],
    out: './drizzle',
    password: '1234',
    host: '43.201.22.60:5432',
    user: 'testuser',
    database: 'grabit',
};
//# sourceMappingURL=drizzle.config2.js.map