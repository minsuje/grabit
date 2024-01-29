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
    await res.setHeader(
      'Authorization',
      'Bearer ' + [loginToken, loginRefreshToken].join(' '),
    );

    // cookie set
    res.cookie('accessToken', loginToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 10 * 1000,
      // maxAge: 6000,
      secure: true,
      sameSite: 'none',
      // path: '/auth',
    });
    res.cookie('refreshToken', loginRefreshToken, {
      httpOnly: true,
      // maxAge: 7 * 24 * 60 * 60 * 1000,
      maxAge: 40 * 1000,
      // maxAge: 10 * 1000,
      secure: true,
      sameSite: 'none',
      // path: '/auth',
    });
    res.cookie('isLoggedIn', true, { httpOnly: false });

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
    res.redirect('http://localhost:5173');
    return res.send({
      accessToken: loginToken,
      refreshToken: loginRefreshToken,
      userid_num: id,
      nickname: username,
      name: username,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/main')
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log('/refresh site 접속 >>>');
    const accessToken = req.headers['authorization'].split(' ')[1];

    console.log('auth controller accessToken >>>>', accessToken);

    const decodedAccessToken = await this.jwtService.verify(accessToken, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (decodedAccessToken.exp < Date.now() / 1000) {
      const loginRefreshToken = req.headers['authorization'].split(' ')[2];

      console.log('Post /refresh refreshtoken >>>', loginRefreshToken);

      try {
        const loginToken = await this.authService.refresh(loginRefreshToken);

        await res.cookie('accessToken', loginToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: 'none',
        });

        const newHeader = await res.setHeader(
          'Authorization',
          'Bearer ' + [loginToken, loginRefreshToken].join(' '),
        );

        return res.send({ msg: '새로운 토큰 발급 완료' });
      } catch (err) {
        console.log('실패');
        res.clearCookie('login Token');
        res.clearCookie('refreshToken');
        // res.clearCookie('accessToken');
        res.clearCookie('isLoggedIn');
        throw new UnauthorizedException();
      }
    } else {
      return res.send({ msg: '토큰이 유효합니다.' });
    }
  }

  @Post('/logout')
  logout(@Res() res: Response, @Req() req: Request) {
    res.cookie('jwt', '', { maxAge: 0 });
    return res.send({ message: 'success' });
  }
}
