import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';
import { localGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
// import { ConfigService } from '@nestjs/config';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    // private configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(localGuard)
  async LoginDto(@Res() res: Response, @Req() req: Request): Promise<any> {
    // const jwt = await this.authService.loginUser(loginDto);
    let token = req.user;
    await res.setHeader('Authorization', 'Bearer ' + token);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' });
    console.log(token);

    return res.send({
      token,
    });
  }

  @Get('/test')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    console.log('req user1 >>>>>>> ', req.user);
    return req.user;
    // const { accessToken, refreshToken } = await this.authService.getJWT(req.user.kakaoId);
    // res.cookie('accessToken', accessToken, { httpOnly: true });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true });
    // res.cookie('isLoggedIn', true, { httpOnly: false });
    // return res.redirect(this.configService.get('CLIENT_URL'));
  }
  @Post('/test')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin2(@Req() req: Request, @Res() res: Response) {
    console.log('req user2 >>>>>>> ', req);
    return req.user;
  }

  @Get('/main')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  // @Get('/cookies')
  // getCookies(@Req() req: Request, @Res() res: Response) {
  //     console.log(req.cookies);
  //     const jwt = req.cookies['jwt'];
  //     return res.send(jwt);
  // }

  @Post('/logout')
  logout(@Res() res: Response, @Req() req: Request) {
    res.cookie('jwt', '', { maxAge: 0 });
    return res.send({ message: 'success' });
  }
}
