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
import { db } from 'db/db';
import { users } from '../user/schema';
import { eq } from 'drizzle-orm';
import { get } from 'http';
import axios from 'axios';

let data;

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

    const {
      loginToken,
      loginRefreshToken,
      userid_num,
      nickname,
      name,
      login_type,
      isLogin,
      validate,
    } = tokens;

    if (
      tokens.msg ===
      '아이디 혹은 비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.'
    ) {
      return res.send({ msg: tokens.msg });
    } else {
      await res.setHeader(
        'Authorization',
        'Bearer ' + [loginToken, loginRefreshToken].join(' '),
      );

      // cookie set
      res.cookie('accessToken', loginToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // maxAge: 10 * 1000,
        // maxAge: 6000,
        secure: true,
        sameSite: 'none',
        // path: '/auth',
      });
      res.cookie('refreshToken', loginRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // maxAge: 40 * 1000,
        // maxAge: 10 * 1000,
        secure: true,
        sameSite: 'none',
        // path: '/auth',
      });
      res.cookie('isLoggedIn', true, { httpOnly: false });

      return res.send({
        accessToken: loginToken,
        refreshToken: loginRefreshToken,
        userid_num,
        nickname,
        name,
        login_type: login_type,
        isLogin,
        validate,
      });
    }
  }

  @Get('/auth/kakao')
  @UseGuards(AuthGuard('kakao'))
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

    const { loginToken, loginRefreshToken, login_type, userid_nums } =
      searchUser;

    const header = await res.setHeader(
      'Authorization',
      'Bearer ' + [loginToken, loginRefreshToken].join(' '),
    );

    res.cookie('accessToken', loginToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // maxAge: 10 * 1000,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', loginRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // maxAge: 40 * 1000,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('isLoggedIn', true, { httpOnly: false });

    data = {
      accessToken: loginToken,
      refreshToken: loginRefreshToken,
      userid_num: userid_nums,
      nickname: username,
      name: username,
      login_type: login_type,
    };
    res.redirect(process.env.RES_REDIRECT);
  }

  @Get('/auth/kakao/redirect')
  async redirect(@Req() req: Request, @Res() res) {
    res.send(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/main')
  status(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers['authorization'].split(' ')[1];

    const decodedAccessToken = await this.jwtService.verify(accessToken, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (decodedAccessToken.exp < Date.now() / 1000) {
      const loginRefreshToken = req.headers['authorization'].split(' ')[2];

      try {
        const loginToken = await this.authService.refresh(loginRefreshToken);

        await res.cookie('accessToken', loginToken, {
          httpOnly: false,
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
        res.clearCookie('login Token');
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.clearCookie('isLoggedIn');
        throw new UnauthorizedException();
      }
    } else {
      return res.send({ msg: '토큰이 유효합니다.' });
    }
  }

  @Post('/logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const clearRefreshToken = await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.userid_num, decodedUserInfo[0].userid_num));

    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    return res.send({ message: 'success' });
  }
}
