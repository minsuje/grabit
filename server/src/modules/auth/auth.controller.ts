import { Body, Controller, Get, HttpException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @UseGuards(AuthGuard('local'))
    LoginDto(@Request() req: Request, @Body() loginDto: LoginDto): any {
        const loginUsers = this.authService.loginUser(loginDto);

        if (!loginUsers) throw new HttpException('Invalid Credentials', 401);
        return loginUsers;
    }
}
