import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DailyMissionModule } from './modules/daily_mission/daily_mission.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { FriendModule } from './modules/friend/friend.module';
import { AuthModule } from './modules/auth/auth.module';
import { s3Middleware } from './middleware/s3.middleware';
import { profileImgMiddleware } from './middleware/profileImg.middleware';
import { ChallengeController } from './modules/challenge/challenge.controller';
import { NotificationModule } from './modules/notification/notification.module';
@Module({
  imports: [
    UserModule,
    DailyMissionModule,
    ChallengeModule,
    FriendModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(s3Middleware).forRoutes('challengeAuth', 'challengeDetail');
    consumer
      .apply(profileImgMiddleware)
      .forRoutes('myPage', 'profileUpload', 'friend', 'profile');
  }
}
