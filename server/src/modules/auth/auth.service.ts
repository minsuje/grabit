import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, and } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
dotenv.config();

interface IPayload {
  userid_num: number;
  name: string;
}
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  loginUser = async ({ userid, password }: LoginDto) => {
    let isLogin: string = 'false';
    let validate: string = 'none';

    // 입력된 아이디에 대한 db에서 password만 가져옴
    const findPassword = await db
      .select({ field: users.password })
      .from(users)
      .where(eq(users.userid, userid));

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

        const tokenInfo = {
          userid_num: loginAccess[0].userid_num,
          // nickname: loginAccess[0].nickname,
          name: loginAccess[0].name,
        };

        // 1. Jwt 토큰 생성
        const loginToken = this.jwtService.sign(tokenInfo);

        // refresh Token 만들기
        const loginRefreshToken = this.jwtService.sign(
          { tokenInfo },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
          },
        );

        // refresh 토큰 암호화
        const hashRefreshToken = await bcrypt.hash(loginRefreshToken, 10);

        // 2. refresh Token 해당 유저에 넣기
        const inputLoginReToken = await db
          .update(users)
          .set({ refreshToken: [hashRefreshToken, userid] })
          .where(eq(users.userid, userid));

        const userid_num = loginAccess[0].userid_num;
        const nickname = loginAccess[0].nickname;
        const name = loginAccess[0].name;

        isLogin = 'true';
        validate = 'true';
        return { loginToken, loginRefreshToken, userid_num, nickname, name };
      } else {
        console.log('비밀번호가 틀렸습니다.');
        validate = 'noPassword';
        return false;
      }
    }
  };

  //카카오
  searchUser = async (
    kakaoId: number,
    profile_img: string,
    username: string,
  ) => {
    console.log('Auth Service search', String(kakaoId));
    // DB에서 카카오 로그인 유저 찾기
    const findUser = await db
      .select()
      .from(users)
      .where(eq(users.userid, String(kakaoId)));

    const clearToken = await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.userid, String(kakaoId)));

    const isClear = await db
      .select()
      .from(users)
      .where(eq(users.userid, String(kakaoId)));

    console.log('isClear >>>> ', isClear);

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

    console.log('console isClear>>>', isClear);
    const kakaoTokenInfo = {
      nickname: isClear[0].nickname,
      name: isClear[0].name,
      userid_num: isClear[0].userid_num,
    };

    console.log('kakaoToken>>> ', kakaoTokenInfo);
    // DB에 내용이 있다면 해당 유저가 refresh 토큰 값을 초기화 하고 새로 넣어주기
    // DB에 유저가 있다면 토큰 생성
    const loginToken = await this.jwtService.sign(kakaoTokenInfo);

    // refresh Token 만들기
    const loginRefreshToken = await this.jwtService.sign(
      { kakaoTokenInfo },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    const kakaoid = String(kakaoId);

    // refreshToken 해싱
    const currentRefreshToken = await bcrypt.hash(loginRefreshToken, 10);
    console.log(currentRefreshToken);

    // db에 넣기
    const inputRefreshToken = await db
      .update(users)
      .set({
        refreshToken: [currentRefreshToken, String(isClear[0].userid_num)],
      })
      .where(eq(users.userid, String(kakaoId)));
    return { loginToken, loginRefreshToken };
  };

  // refresh 토큰을 통해 재발급
  refresh = async (loginRefreshToken: string) => {
    try {
      console.log('refreshToken 재발급 시작 >>>>>>>>', loginRefreshToken);
      // 1차검증 쿠키에 있는 refresh 토큰 복호화
      const decodedRefreshToken = this.jwtService.verify(loginRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      console.log('decodedRefreshToken >>>>>>>', decodedRefreshToken.tokenInfo);

      // DB에 저장되어 있는 유저 찾기
      let user = await db
        .select()
        .from(users)
        .where(eq(users.userid_num, decodedRefreshToken.tokenInfo.userid_num));

      console.log('refresh user > ', user);

      const refreshTokenMatching = await bcrypt.compare(
        loginRefreshToken,
        user[0].refreshToken[0],
      );

      if (!refreshTokenMatching)
        throw new UnauthorizedException('Invalid refresh-token');

      // 새로운 토큰 발급
      const loginToken = this.jwtService.sign({
        userid_num: user[0].userid_num,
        nickname: user[0].nickname,
        name: user[0].name,
      });

      console.log('service loginToken >', loginToken);

      return loginToken;
    } catch {
      return {
        statusCode: 401,
        message: 'Unauthorized',
      };
    }
  };

  // validateUser = async (payload: IPayload) => {
  //   console.log('validateUser >>>>>>>>', payload.userid_num);
  //   const user = await db
  //     .select()
  //     .from(users)
  //     .where(
  //       and(
  //         eq(users.userid_num, payload.userid_num),
  //         eq(users.name, payload.name),
  //       ),
  //     );
  //   return user;
  // };
}
