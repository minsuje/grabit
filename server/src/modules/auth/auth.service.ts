import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    loginUser = async ({ userid, password }: LoginDto) => {
        let isLogin = 'false';

        const loginAccess = await db
            .select()
            .from(users)
            .where(eq(users.userid, userid) && eq(users.password, password));

        console.log('islogin >>>>>>>>', loginAccess);

        if (loginAccess.length != 0) {
            isLogin = 'true';
            loginAccess; // user 정보
            return this.jwtService.sign({ userid }); // jwt토큰 생성
        }
        return loginAccess;
        // } else {
        //     console.log('isLogin else', isLogin);
        //     return isLogin; // "false"
        // }
    };
}
