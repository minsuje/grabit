import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'userid',
            passwordField: 'password',
        });
    }

    async validate(userid: string, password: string) {
        const user = await this.authService.loginUser({ userid, password });
        // console.log('localSt 에서 확인하는 userid', userid);
        // console.log('지금 localStategy에서 출력중 >>>>>', user);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
