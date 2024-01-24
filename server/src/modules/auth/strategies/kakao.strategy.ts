import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.REST_API_KEY,
      clientSecret: process.env.KKT_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
  // async validate(
  //     accessToken: string,
  //     refreshToken: string,
  //     profile: Profile,
  //     done: (err: any, user?: any, info?: any) => void,
  // ) {
  //     try {
  //         console.log('kakao strategy profile >>', profile);
  //         console.log('kakao strategy accessToken >>', accessToken);
  //         console.log('kakao strategy refreshToken >>', refreshToken);
  //         const { _json } = profile;
  //         const user = {
  //             kakaoId: _json.id,
  //         };
  //         done(null, user);
  //     } catch (error) {
  //         done(error);
  //     }
  // }
}
