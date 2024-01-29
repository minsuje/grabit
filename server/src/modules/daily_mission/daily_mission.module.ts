import { Module } from '@nestjs/common';
import { DailyMissionController } from './daily_mission.controller';
import { DailyMissionService } from './daily_mission.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [DailyMissionController],
  providers: [DailyMissionService, JwtService],
})
export class DailyMissionModule {}
