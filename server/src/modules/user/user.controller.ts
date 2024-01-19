import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
import { UserService } from './user.service';
import { User } from './user.module';
import { db } from '../../../db/db';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

    @Post('/register/:type')
    createUserDto(@Param('type') type: string, @Body() createUserDto: CreateUserDto): User {
        return this.userService.createNewUser(createUserDto);
        const createUser = db.insert().values(createUserDto);
    }
}
