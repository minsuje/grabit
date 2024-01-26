import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    // validate(loginDto: any) {
    //     console.log('Inside jwt strategy');
    //     console.log(loginDto);
    //     return loginDto;
    // }
    async validate(userid: string, password: string) {
        const user = await this.authService.loginUser({ userid, password });
        console.log('jwt strategy >>>> ', user)
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
