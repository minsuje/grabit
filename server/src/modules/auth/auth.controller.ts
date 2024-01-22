import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';
import { localGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('/')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(localGuard)
    LoginDto(@Req() req: Request) {
        return req.user;
    }
    // LoginDto(@Body() loginDto: LoginDto): any {
    //     // const user = this.authService.loginUser(loginDto);
    //     // return user;
    // }

    @Get('/main')
    @UseGuards(JwtAuthGuard)
    status(@Req() req: Request) {
        console.log('Inside AuthController status method');
        console.log(req.user);
        return req.user;
    }
}
