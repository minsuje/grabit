import {
  Body,
  Controller,
  Get,
  Headers,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DailyMissionService } from './daily_mission.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('/')
export class DailyMissionController {
  constructor(private dailyMissionService: DailyMissionService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/dailyMission')
  async GetDaily(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('authorization') authHeader: string,
  ) {
    return this.dailyMissionService.getDailyMission();
  }
}
