import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
import { UserService } from './user.service';
import { User } from './user.module';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post('/register/:type')
  // createUserDto(@Param('type') type: string, @Body() createUserDto: CreateUserDto): User {
  //     return this.userService.createNewUser(createUserDto);
  // }
}
