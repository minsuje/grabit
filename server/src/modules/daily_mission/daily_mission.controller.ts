import { Body, Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DailyMissionService } from './daily_mission.service';

@Controller('/')
export class DailyMissionController {
  constructor(private dailyMissionService: DailyMissionService) {}
  @Get('/dailyMission')
  async GetDaily(@Req() req: Request, @Res() res: Response) {
    return this.dailyMissionService.getDailyMission();
  }
}
