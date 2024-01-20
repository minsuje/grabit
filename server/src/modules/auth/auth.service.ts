import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    loginUser = async (loginDto: LoginDto) => {
        const { userid, password } = loginDto;
        let isLogin = 'false';

        const inputLogin: LoginDto = {
            userid,
            password,
        };
        const loginAccess = await db
            .select()
            .from(users)
            .where(eq(users.userid, userid) && eq(users.password, password));

        if (loginAccess.length != 0) {
            isLogin = 'true';
            loginAccess; // user 정보
            return this.jwtService.sign(userid);
        } else {
            console.log('isLogin else', isLogin);
            return isLogin; // "false"
        }
    };
}
