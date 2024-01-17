import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as schema from '../src/drizzle/schema';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`
    }),
    DrizzlePGModule.registerAsync({
      tag: 'DB_PROD',
      useFactory: (configService: ConfigService) => ({
        pg: {
          connection: 'client',
          config: {
            connectionString: configService.get('DATABASE_HOST'),
          },
        },
        config: { schema: { ...schema } },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}