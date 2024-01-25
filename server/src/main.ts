import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from '../db/db';
import { users } from '../src/modules/user/schema';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
// import * as fs from 'fs';
// import * as https from 'https';

async function bootstrap() {
  // const httpsOptions = {
  //     key: fs.readFileSync('./server-key.pem'),
  //     cert: fs.readFileSync('./server.pem'),
  // };
  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });

  app.enableCors({
    origin: [
      'http://3.34.122.205:5173',
      'http://localhost:5173',
      'https://localhost:5173',
      'https://accounts.kakao.com',
      'https://accounts.kakao.com/login',
      'http://localhost:3000/auth/kakao',
    ],
    preflightContinue: false,
    credentials: true,
  });
  app.use(cookieParser());

  // getUsers();

  const options = new DocumentBuilder()
    .setTitle('grabit API')
    .setDescription('API 문서를 위한 NestJS와 Swagger 예제')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

// async function getUsers() {
//   const user = await db.select().from(users);
//   console.log(user);
// }
