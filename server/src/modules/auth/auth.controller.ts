import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';

@Controller('/')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    LoginDto(@Body() loginDto: LoginDto): any {
        return this.authService.loginUser(loginDto);
    }
}
