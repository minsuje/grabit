import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as schema from './modules/drizzle/schema';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import configuration from './config/configuration';
import appConfig from './config/app.config';
// import {DrizzleModule} from "./config/drizzle/drizzle.module";
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [appConfig],
    }),
    DrizzlePGModule.registerAsync({
      tag: 'DB_PROD',
      useFactory: (configService: ConfigService) => ({
        pg: {
          connection: 'client',
          config: {
            connectionString: process.env.DATABASE_URL,
          },
        },
        config: { schema: { ...schema } },
      }),
      inject: [ConfigService],
    }),
    DbModule,
  ],
  // imports: [DrizzleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
