import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { users } from './schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class UserService {
    createNewUser = async (login_type: any, createUserDto: CreateUserDto) => {
        const { userid, social_userid, password, name, nickname, profile_img, score_num, money } = createUserDto;

        const userInfo: CreateUserDto = {
            login_type: login_type,
            userid: userid,
            social_userid: social_userid,
            password: password,
            name: name,
            nickname: nickname,
            profile_img: profile_img,
            score_num: score_num,
            money: money,
        };
        return await db.insert(users).values(userInfo);
        // return userInfo;
    };
}
