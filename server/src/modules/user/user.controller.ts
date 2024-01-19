import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { db } from '../../../db/db';
import { users } from './schema';
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register/:type')
    createUserDto(@Param('type') type: string, @Body() createUserDto: CreateUserDto): any {
        return db.insert(users).values(createUserDto);
    }
}
