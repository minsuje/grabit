import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DailyMissionService } from './daily_mission.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('/')
export class DailyMissionController {
  constructor(
    private dailyMissionService: DailyMissionService,
    private jwtService: JwtService,
  ) {}
  // @UseGuards(JwtAuthGuard)
  @Get('/dailyMission')
  async GetDaily(@Req() req: Request, @Res() res: Response) {
    const userInfo = req.headers['authorization'].split(' ')[1];

    if (userInfo.length == 0) {
      return res.send(false);
    }

    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const { userid_num } = decodedUserInfo;
    const isSuccess =
      await this.dailyMissionService.getDailyMission(userid_num);
    return res.send(isSuccess);
  }

  @Patch('/DailymissionAuth')
  async PatchDaily(
    @Req() req: Request,
    @Res() res: Response,
    @Body() isSuccess: Boolean,
  ) {
    const userInfo = await req.headers['authorization'].split(' ')[1];

    const users = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = users.userid_num;
    const insert = await this.dailyMissionService.success(
      isSuccess,
      userid_num,
    );
    if (insert) {
      return res.send({
        msg: '데일리 미션 성공',
      });
    } else {
      return res.send({
        msg: '데일리 미션 실패',
      });
    }
  }
}
