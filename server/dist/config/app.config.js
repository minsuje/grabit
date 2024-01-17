"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("app", () => ({
    host: process.env.DATABASE_ENDPOINT || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 3000,
}));
//# sourceMappingURL=app.config.js.map