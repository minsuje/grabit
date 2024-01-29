import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

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
    console.log('login controller >>>>>>>>>.', req.user);
    const token = JSON.stringify(req.user);
    const tokens = JSON.parse(token);
    const { loginToken, loginRefreshToken, userid_num, nickname, name } =
      tokens;

    // console.log('login controller >>>>>>>>>.', req.user);
    // await res.setHeader(
    //   'Authorization',
    //   'Bearer ' + [loginToken, loginRefreshToken],
    // );

    // cookie set
    res.cookie('accessToken', loginToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 10 * 1000,
      // maxAge: 6000,
      // secure: true,
      // sameSite: 'none',
      // path: '/auth',
    });
    res.cookie('refreshToken', loginRefreshToken, {
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 40 * 1000,
      // maxAge: 10 * 1000,
      // secure: true,
      // sameSite: 'none',
      // path: '/auth',
    });

    console.log('/ > ', loginToken);

    return res.send({
      accessToken: loginToken,
      refreshToken: loginRefreshToken,
      userid_num,
      nickname,
      name,
    });

    // return this.authService.loginUser(req.body);
  }

  @UseGuards(AuthGuard('kakao'))
  @Get('/test')
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const user = JSON.stringify(req.user);
    const users = JSON.parse(user);

    const { username, profile_image, id } = users;

    // searchUser service 값 보내기
    let searchUser = await this.authService.searchUser(
      id,
      profile_image,
      username,
    );
    const { loginToken, loginRefreshToken } = searchUser;

    await res.setHeader(
      'Authorization',
      'Bearer ' + [loginToken, loginRefreshToken],
    );

    console.log('controller searchUser > ', searchUser);

    res.cookie('accessToken', loginToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 10 * 1000,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', loginRefreshToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 40 * 1000,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect('http://localhost:5173');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/main')
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log('req.cookies', req.cookies);
    console.log('/refresh site 접속 >>>');
    if (!req.cookies.accessToken) {
      if (req.cookies.refreshToken) {
        console.log('refreshToken이 있습니다. 계속 진행합니다.');
        try {
          const newAccessToken = await this.authService.refresh(
            req.cookies.refreshToken,
          );

          // console.log('controller new access token >', newAccessToken);

          await res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            // maxAge: 24 * 60 * 60 * 1000,
            // maxAge: 10 * 60 * 60 * 1000,
            maxAge: 10 * 1000,
            // secure: true,
            // sameSite: 'none',
          });
          console.log('accessToken을 새로 발급했습니다');
          return res.send({
            Message: 'new token success',
          });
        } catch (err) {
          console.log('실패');
          res.clearCookie('login Token');
          res.clearCookie('refreshToken');
          res.clearCookie('jwt');
          // res.clearCookie('accessToken');
          res.clearCookie('isLoggedIn');
          throw new UnauthorizedException();
        }
      } else {
        console.log('refreshToken이 없습니다');
      }
    } else {
      console.log('이미 accessToken이 있습니다');
      return res.send({
        isExpired: true,
      });
    }
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
