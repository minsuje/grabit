import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { users } from './schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  createNewUser = async (login_type: any, createUserDto: CreateUserDto) => {
    const { userid, social_userid, password, name, nickname, profile_img, score_num, money } = createUserDto;

    const hash: string = await bcrypt.hash(password, 10);

    const userInfo: CreateUserDto = {
      login_type: login_type,
      userid: userid,
      social_userid: social_userid,
      password: hash,
      name: name,
      nickname: nickname,
      profile_img: profile_img,
      score_num: score_num,
      money: money,
    };
    const checkUser = await db.select().from(users).where(eq(users.userid, userid));
    if (checkUser.length == 0) {
      return await db.insert(users).values(userInfo);
    } else {
      const isLogins = false;
      return isLogins;
    }

    // return userInfo;
  };

  getMyPage = async (userid_num: number) => {
    const userInfo = await db
      .select({ nickname: users.nickname, score_num: users.score_num, money: users.money })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    return { userInfo };
  };
}
