import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, sql, and } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  loginUser = async ({ userid, password }: LoginDto) => {
    let isLogin: string = 'false';
    let validate: string = 'none';

    // 입력된 아이디에 대한 db에서 password만 가져옴
    const findPassword = await db.select({ field: users.password }).from(users).where(eq(users.userid, userid));
    console.log('findPassword >>>>', findPassword);

    if (!findPassword.length) {
      console.log('존재하지 않는 계정입니다.');
      return (validate = 'none');
    } else {
      const { field } = findPassword[0];

      // 비밀번호 비교
      const checkPassword = await bcrypt.compare(password, field);

      // true 반환
      console.log('check Password >>>>', checkPassword);
      if (checkPassword) {
        const loginAccess = await db
          .select()
          .from(users)
          .where(and(eq(users.userid, userid), eq(users.password, field)));

        isLogin = 'true';
        validate = 'true';
        // return { accessToken: this.jwtService.sign({ loginAccess }) }; // jwt토큰 생성}
        return this.jwtService.sign({ loginAccess });
      } else {
        console.log('비밀번호가 틀렸습니다.');
        validate = 'noPassword';
        return false;
      }
    }
  };
  searchUser = async (kakaoId: number, profile_img: string, username: string) => {
    console.log('Auth Service search', String(kakaoId));
    const findUser = await db
      .select()
      .from(users)
      .where(eq(users.userid, String(kakaoId)));

    if (findUser.length == 0) {
      const newUser = await db.insert(users).values({
        login_type: 'kakao',
        userid: String(kakaoId),
        profile_img,
        name: username,
        nickname: username,
      });
    }
    return;
  };

  // getJWT = async (kakaoId: number) => {
  //     const user = await this.kakaoValidateUser(kakaoId); // 카카오 정보 검증 및 회원가입 로직
  //     const accessToken = this.generateAccessToken(user); // AccessToken 생성
  //     const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
  //     return { accessToken, refreshToken };
  // };
}
