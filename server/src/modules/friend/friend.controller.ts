import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtService } from '@nestjs/jwt';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('/friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private jwtService: JwtService,
  ) {}

  //# 유저 친구 조회
  @Get(':userid')
  findOne(@Param('userid') userid: number, @Req() req) {
    let friends_info = req.file;
    return this.friendService.findOne(userid, friends_info);
  }

  //# 유저 친구 추가
  @Post(':userid')
  async create(
    @Body() createFriendDto: CreateFriendDto,
    @Param('userid') userid: number,
    @Req() request: Request,
  ) {
    // 로그인한 유저 정보
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const login_userid_num = decodedUserInfo.userid_num;

    return this.friendService.create(createFriendDto, userid, login_userid_num);
  }

  //# 유저 친구 수락 / 거절
  @Patch(':userid')
  async update(
    @Body() updateFriendDto: UpdateFriendDto,
    @Param('userid') userid: number,
    @Req() request: Request,
  ) {
    // 로그인한 유저 정보
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const login_userid_num = decodedUserInfo.userid_num;
    return this.friendService.update(userid, updateFriendDto, login_userid_num);
  }

  //# 유저 친구 삭제
  @Delete(':userid')
  remove(
    @Body() createFriendDto: CreateFriendDto,
    @Param('userid') userid: number,
  ) {
    return this.friendService.remove(createFriendDto, userid);
  }

  //# 친구 프로필 상세 보기
  @Get('/detail/:userid_num')
  getFriendDetail(@Param('userid_num') userid_num: number, @Req() req) {
    return req.file;
  }

  // @Get()
  // findAll() {
  //   return this.friendService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
  //   return this.friendService.update(+id, updateFriendDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendService.remove(+id);
  // }
}
