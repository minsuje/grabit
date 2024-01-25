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

    @Get('/myPage/:userid_num')
    getMyPage(@Param('userid_num') userid_num: number) {
        return this.userService.getMyPage(userid_num);
    }
}
