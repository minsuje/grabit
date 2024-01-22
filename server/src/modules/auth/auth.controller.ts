import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';
import { localGuard } from './guards/local.guard';

@Controller('/')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(localGuard)
    LoginDto(@Request() req: Request, @Body() loginDto: LoginDto): any {
        const user = this.authService.loginUser(loginDto);
        console.log('controller >>>> ', user);
        return user;
    }
}
