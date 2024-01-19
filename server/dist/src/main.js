"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const db_1 = require("../db/db");
const schema_1 = require("../src/modules/user/schema");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
    const user = db_1.db.select().from(schema_1.users);
    console.log(user);
}
bootstrap();
//# sourceMappingURL=main.js.map