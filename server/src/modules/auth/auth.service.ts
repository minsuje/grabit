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

        // const inputLogin: LoginDto = {
        //     userid,
        //     password,
        // };
        const loginAccess = await db
            .select()
            .from(users)
            .where(eq(users.userid, userid) && eq(users.password, password));

        // const check = await db.select().from(users);
        // console.log(check);
        // console.log('loginAccess clear>>>>>>>>', loginAccess);

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
