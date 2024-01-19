import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
@Controller('user')
export class UserController {
  // @Post('/register/:type')
  // createUserDto(@Param('type') type: string, @Body() createUserDto: CreateUserDto): User {
  //     return this.userService.createUserDto(CreateUserDto);
  // }
}
