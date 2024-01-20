import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
@Controller('/register')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/:type')
    createUserDto(@Param('type') login_type: string, @Body() createUserDto: CreateUserDto): any {
        return this.userService.createNewUser(login_type, createUserDto);
    }

    @Get('/login')
    LoginDto(@Body() loginDto: LoginDto): any {
        return this.userService.loginUser(loginDto);
    }
}
