import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import * as dotenv from 'dotenv';
// initialize dotenv
dotenv.config();

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
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
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
}
