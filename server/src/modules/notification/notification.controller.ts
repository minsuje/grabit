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
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  // @Get()
  // findAll() {
  //   return this.notificationService.findAll();
  // }

  @Get()
  async findOne(@Param('id') id: string, @Req() req) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    console.log(userid_num);
    // const result = await this.notificationService.findOne(userid_num);
    // return res.send(result);
    return this.notificationService.findOne(userid_num);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }
  ß;
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
