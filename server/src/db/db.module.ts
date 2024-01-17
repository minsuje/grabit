import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbService } from "./db.service";
import dbConfig from "../config/db.config";

@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [DbService],
})
export class DbModule {}
