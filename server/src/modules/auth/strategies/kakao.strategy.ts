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
    console.log('kakao strategy >>>>> 지금 여기');
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('kakao strategy profile >>>>>', profile);
    console.log('Kakao validate method called.');
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);
    const { _json } = profile;
    const user = {
      id: _json.id,
      username: _json.properties.nickname,
      profile_image: _json.properties.profile_image,
    };
    const { username, profile_image, id } = user;
    console.log('kakao strategy profile json >>>>>', _json);
    return { accessToken, refreshToken, username, profile_image, id };
  }
  //   async validate(
  //     accessToken: string,
  //     refreshToken: string,
  //     profile: Profile,
  //     done: (err: any, user?: any, info?: any) => void,
  //   ) {
  //     try {
  //       console.log('kakao strategy profile >>', profile);
  //       console.log('kakao strategy accessToken >>', accessToken);
  //       console.log('kakao strategy refreshToken >>', refreshToken);
  //       const { _json } = profile;
  //       const user = {
  //         kakaoId: _json.id,
  //       };
  //       done(null, user);
  //     } catch (error) {
  //       done(error);
  //     }
  //   }
}
