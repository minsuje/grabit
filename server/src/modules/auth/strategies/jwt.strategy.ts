import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { db } from 'db/db';
import { users } from 'src/modules/user/schema';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => {
      //     let token = null;
      //     if (request && request.cookies) {
      //       token = request.cookies['refreshToken'];
      //       // console.log('accessToken', token);
      //     }
      //     return token;
      //   },
      // ]),

      // 이렇게 작성하면 프론트에서 따로 Header에 Bearer Auth 를 보내지 않아도 됩니다.
      // 어차피 서버에서 이미 프론트에게 쿠키로 토큰들을 전달했기 때문이죠.
      // 따로 처리를 하지 않아도 자동으로 서버와 프론트는 쿠키를 주고받습니다.
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     console.log(
      //       '🚀 ~ JwtStrategy ~ constructor ~ accessToken:',
      //       request?.cookies?.accessToken,
      //     );
      //     return request?.cookies?.accessToken;
      //   },
      // ]),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
    console.log('JWT Strategy>>>>>>>>>>');
  }

  async validate(payload: any) {
    console.log('jwt Strategy payload >>> ', payload);

    if (payload.exp < Date.now() / 1000) {
      // 토큰이 만료된 경우

      console.log('if문 안에서 시작 >>>> ');
      throw new UnauthorizedException('Token has expired');
    }
    return { userid: payload.userid, name: payload.name };
  }

  // validate(loginDto: any) {
  //     console.log('Inside jwt strategy');
  //     console.log(loginDto);
  //     return loginDto;
  // }
  // async validate(userid: string, password: string) {
  //   const user = await this.authService.loginUser({ userid, password });
  //   console.log('jwt strategy >>>> ', user);
  //   if (!user) throw new UnauthorizedException();
  //   return user;
  // }

  // jwt 전략인데 왜 userid, password로 검증을 하는지 의문입니다.
  // async validate(userid: string, password: string) {
  //   try {
  //     const user = await this.authService.loginUser({ userid, password });
  //     console.log('jwt strategy >>>> ', user);
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  //   }
  // }

  // async validate(payload: IPayload): Promise<any> {
  //   const user = await this.authService.validateUser(payload);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
