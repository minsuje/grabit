import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
@Controller('/')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register/:type')
    createUserDto(@Param('type') login_type: string, @Body() createUserDto: CreateUserDto): any {
        return this.userService.createNewUser(login_type, createUserDto);
    }
}
