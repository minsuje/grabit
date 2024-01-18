import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { DailyMissionModule } from './modules/daily_mission/daily_mission.module';
import { FollowModule } from './modules/follow/follow.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
    imports: [UserModule, AccountModule, FollowModule, DailyMissionModule, ChallengeModule, AlarmModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
