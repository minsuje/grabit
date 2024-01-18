import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AccountModule } from './account/account.module';
import { DailyMissionModule } from './daily_mission/daily_mission.module';
import { DailyMissionModule } from './daily-mission/daily-mission.module';
import { DailyMissionModule } from './daily-mission/daily-mission.module';
import { DailyMissionModule } from './daily-mission/daily-mission.module';
import { FollowModule } from './follow/follow.module';
import { AccountModule } from './account/account.module';
import { ChallengeModule } from './modules/challenge/challenge.module';


@Module({
  imports: [UserModule, DrizzleModule, AccountModule, FollowModule, DailyMissionModule, ChallengeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
