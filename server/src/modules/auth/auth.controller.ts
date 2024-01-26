import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth-dto';
import { localGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { stringify } from 'querystring';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(localGuard)
  async LoginDto(@Res() res: Response, @Req() req: Request): Promise<any> {
    const token = JSON.stringify(req.user);
    const tokens = JSON.parse(token);
    const { loginToken, loginRefreshToken } = tokens;

    // console.log('login controller >>>>>>>>>.', req.user);
    await res.setHeader('Authorization', 'Bearer ' + [loginToken, loginRefreshToken]);

    // cookie set
    res.cookie('jwt', loginToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' });
    res.cookie('refreshToken', loginRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });

    console.log(loginToken);
    console.log(loginRefreshToken);

    return res.send({
      loginToken,
      loginRefreshToken,
    });
  }

  @Get('/test')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const user = JSON.stringify(req.user);
    const users = JSON.parse(user);

    const { accessToken, refreshToken, username, profile_image, id } = users;

    // searchUser service 값 보내기
    let searchUser = await this.authService.searchUser(id, profile_image, username);

    console.log('controller searchUser > ', searchUser);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect('http://localhost:5173');
  }

  // @Post('/test')
  // @UseGuards(AuthGuard('kakao'))
  // @HttpCode(301)
  // async kakaoLogin2(@Req() req: Request, @Res() res: Response) {
  //   console.log('req user2 >>>>>>> ', req);
  //   return req.user;
  // }

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
