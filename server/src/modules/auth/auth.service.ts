import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, sql, and, isNull } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  loginUser = async ({ userid, password }: LoginDto) => {
    let isLogin: string = 'false';
    let validate: string = 'none';

    // 입력된 아이디에 대한 db에서 password만 가져옴
    const findPassword = await db.select({ field: users.password }).from(users).where(eq(users.userid, userid));

    // 해당하는 비멀번호를 가지고 있지 않을 시
    if (!findPassword.length) {
      console.log('존재하지 않는 계정입니다.');
      return (validate = 'none');
    } else {
      // 비밀번호가 존재한다면

      const { field } = findPassword[0];

      // 비밀번호 비교
      const checkPassword = await bcrypt.compare(password, field);

      // true 반환
      console.log('check Password >>>>', checkPassword);
      if (checkPassword) {
        // DB에 저장되어 있는 refresh token clear
        const clearToken = await db
          .update(users)
          .set({ refreshToken: null })
          .where(and(eq(users.userid, userid), eq(users.password, field)));

        // 유저 정보 찾아서 담기
        const loginAccess = await db
          .select()
          .from(users)
          .where(and(eq(users.userid, userid), eq(users.password, field)));
        console.log('DB에 넣기전 login Access Token >>>> ', loginAccess);

        // 1. Jwt 토큰 생성
        const loginToken = this.jwtService.sign({ loginAccess });

        // refresh Token 만들기
        const loginRefreshToken = this.jwtService.sign(
          { loginAccess },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
          },
        );
        // 2. refresh Token 해당 유저에 넣기
        const inputLogoinReToken = await db
          .update(users)
          .set({ refreshToken: loginRefreshToken })
          .where(eq(users.userid, userid));

        isLogin = 'true';
        validate = 'true';
        return { loginToken, loginRefreshToken };
      } else {
        console.log('비밀번호가 틀렸습니다.');
        validate = 'noPassword';
        return false;
      }
    }
  };

  searchUser = async (kakaoId: number, profile_img: string, username: string) => {
    console.log('Auth Service search', String(kakaoId));
    // DB에서 카카오 로그인 유저 찾기
    const findUser = await db
      .select()
      .from(users)
      .where(eq(users.userid, String(kakaoId)));

    console.log('find User >>>>> ', findUser);

    // 유저가 없다면 DB에 유저 추가
    if (findUser.length == 0) {
      const newUser = await db.insert(users).values({
        login_type: 'kakao',
        userid: String(kakaoId),
        profile_img,
        name: username,
        nickname: username,
      });
    }
    // DB에 내용이 있다면 해당 유저가 refresh 토큰 값을 초기화 하고 새로 넣어주기
    const clearToken = await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.userid, String(kakaoId)));

    const isClear = await db
      .select({ refreshToken: users.refreshToken })
      .from(users)
      .where(eq(users.userid, String(kakaoId)));

    console.log('isClear >>>> ', isClear);

    // DB에 유저가 있다면 토큰 생성
    const loginToken = this.jwtService.sign({ findUser });

    // refresh Token 만들기
    const refreshToken = this.jwtService.sign(
      { findUser },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    console.log('refreshToken >>>> ', refreshToken);
    // db에 넣기
    const inputRefreshToken = await db
      .update(users)
      .set({ refreshToken: refreshToken })
      .where(eq(users.userid, String(kakaoId)));
    return { refreshToken, loginToken };
  };
}
