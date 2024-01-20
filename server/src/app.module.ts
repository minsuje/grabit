import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DailyMissionModule } from './modules/daily_mission/daily_mission.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { AlarmModule } from './modules/alarm/alarm.module';
import { FriendModule } from './modules/friend/friend.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [UserModule, DailyMissionModule, ChallengeModule, AlarmModule, FriendModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
