import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from '../db/db';
import { users } from '../src/modules/user/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  getUsers();
}
bootstrap();

async function getUsers() {
  const user = await db.select().from(users);
  console.log(user);
}
