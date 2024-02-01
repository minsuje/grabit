import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { PaymentDTO } from './dto/paymentsDto';
import { users } from './schema';
import { db } from 'db/db';
import { eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { response } from 'express';

// const got = require('got');
// import * as got from 'got';

@Injectable()
export class UserService {
  createNewUser = async (login_type: any, createUserDto: CreateUserDto) => {
    const {
      userid,
      social_userid,
      password,
      name,
      nickname,
      profile_img,
      score_num,
      money,
    } = createUserDto;

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
    const checkUser = await db
      .select()
      .from(users)
      .where(eq(users.userid, userid));

    let isLogins = false;
    if (checkUser.length !== 0) {
      console.log('user.service >>>>> check user 밖에서');
      const isLogins = false;
      console.log(isLogins);
      return isLogins;
    } else {
      console.log('user.service >>>>> check user 안에서');
      const CUser = await db.insert(users).values(userInfo);
      return (isLogins = true);
    }
    // return userInfo;
  };

  postProfileUpload = async (
    login_type: string,
    createUserDto: CreateUserDto,
    file: string,
  ) => {
    return file;
  };

  // 프로필 조회
  getMyPage = async (userid_num: number, file: string) => {
    const userInfo = await db
      .select({
        nickname: users.nickname,
        score_num: users.score_num,
        money: users.money,
      })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    return { userInfo, file };
  };

  // 프로필 수정
  patchMyPage = async (userid_num: number, file: string, body: any) => {
    const { nickname, profile_img, currentPassword, changePassword } = body;
    const filename = file.split('/')[3].split('?')[0];
    let isUser = false;
    const myDbPassword = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.userid_num, userid_num));

    const myPassword = myDbPassword[0];
    const checkPassword = await bcrypt.compare(
      currentPassword,
      myPassword.password,
    );

    // console.log('user service checkPassword >>', checkPassword);

    if (checkPassword) {
      if (changePassword) {
        const newPassword = await bcrypt.hash(changePassword, 10);
        const userInfo = await db
          .update(users)
          .set({
            password: newPassword,
            nickname: nickname,
            profile_img: filename,
          })
          .where(eq(users.userid_num, userid_num));

        isUser = true;
        return { userInfo, file, isUser };
      } else {
        const userInfo = await db
          .update(users)
          .set({
            nickname: nickname,
            profile_img: filename,
          })
          .where(eq(users.userid_num, userid_num));
        isUser = true;
        return { userInfo, file, isUser };
      }
    } else {
      return { msg: '비밀번호를 다시 한번 확인해 주세요', isUser };
    }
  };

  async getScore(userid: number) {
    return await db
      .select({
        score_num: users.score_num,
      })
      .from(users);
  }

  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  tossPayment = async (paymentDTO: PaymentDTO) => {
    // console.log('service > ', response);
    const { orderId, amount, paymentKey } = paymentDTO;
    try {
      const response = await axios.post(
        `${this.tossUrl}/${paymentKey}`,
        { orderId, amount },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        title: '결제 성공',
        body: response.data,
        // amount: response.data. totalAmount,
      };
    } catch (e) {
      console.log('토스페이먼츠 에러', e);
    }
  };
}
