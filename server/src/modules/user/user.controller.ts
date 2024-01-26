import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
@Controller('/')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register/:type')
  createUserDto(
    @Param('type') login_type: string,
    @Body() createUserDto: CreateUserDto,
  ): any {
    console.log('register controller body', createUserDto);
    return this.userService.createNewUser(login_type, createUserDto);
  }

  @Post('/profileUpload/:type')
  postProfileUpload(
    @Param('type') login_type: string,
    @Body() body: any,
    @Req() req,
  ): any {
    console.log('profileUpload controller body', body);
    console.log('controller postProfileUpload', req.file);
    const file = req.file;
    return this.userService.postProfileUpload(login_type, body, file);
  }

  @Get('/myPage/:userid_num')
  getMyPage(@Param('userid_num') userid_num: number, @Req() req) {
    console.log('myPage controller req.file > ', req.file);
    return this.userService.getMyPage(userid_num);
  }

  @Get('score/:userid')
  getScore(@Param('userid') userid: number) {
    return this.userService.getScore(userid);
  }
}
