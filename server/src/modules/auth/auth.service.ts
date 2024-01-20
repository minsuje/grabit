import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth-dto';
import { users } from '../user/schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class AuthService {
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
            return loginAccess; // user 정보
        } else {
            console.log('isLogin else', isLogin);
            return isLogin; // "false"
        }
    };
}
