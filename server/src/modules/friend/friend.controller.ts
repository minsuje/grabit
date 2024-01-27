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
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':userid')
  findOne(@Param('userid') userid: number, @Req() req) {
    console.log('controller friend > ', req.file);
    let friends_info = req.file;
    return this.friendService.findOne(userid, friends_info);
  }

  @Post(':userid')
  create(
    @Body() createFriendDto: CreateFriendDto,
    @Param('userid') userid: number,
  ) {
    return this.friendService.create(createFriendDto, userid);
  }

  @Patch(':userid')
  update(
    @Body() updateFriendDto: UpdateFriendDto,
    @Param('userid') userid: number,
  ) {
    return this.friendService.update(userid, updateFriendDto);
  }

  @Delete(':userid')
  remove(
    @Body() createFriendDto: CreateFriendDto,
    @Param('userid') userid: number,
  ) {
    return this.friendService.remove(createFriendDto, userid);
  }

  // 친구 프로필 상세 보기
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
