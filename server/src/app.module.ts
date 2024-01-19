import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DailyMissionModule } from './modules/daily_mission/daily_mission.module';
import { FollowModule } from './modules/follow/follow.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { AlarmModule } from './modules/alarm/alarm.module';
import { ScoreModule } from './modules/score/score.module';

@Module({
  imports: [
    UserModule,
    FollowModule,
    DailyMissionModule,
    ChallengeModule,
    AlarmModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
