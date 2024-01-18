import { Module } from '@nestjs/common';
import { DailyMissionController } from './daily_mission.controller';
import { DailyMissionService } from './daily_mission.service';

@Module({
  controllers: [DailyMissionController],
  providers: [DailyMissionService]
})
export class DailyMissionModule {}
