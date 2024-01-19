import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from '../db/db';
import { users } from '../src/modules/user/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const user = db.select().from(users);

  console.log(user);
}
bootstrap();
