"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        host: process.env.DATABASE_ENDPOINT || "localhost",
        port: parseInt(process.env.DATABASE_PORT, 10) || 3000,
    },
    db: {
        host: process.env.DATABASE_ENDPOINT,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
});
//# sourceMappingURL=configuration.js.map