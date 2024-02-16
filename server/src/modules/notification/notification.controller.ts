import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtService } from '@nestjs/jwt';
@Controller('/notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async findOne(@Req() req) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    // const result = await this.notificationService.findOne(userid_num);
    // return res.send(result);
    return this.notificationService.findOne(userid_num);
  }

  // 알림 확인하기
  @Patch('/:notification_id')
  async patchNoti(@Param('notification_id') notification_id: number) {
    return this.notificationService.patchNoti(notification_id);
  }
}
