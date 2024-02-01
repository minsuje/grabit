import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { PaymentDTO } from './dto/paymentsDto';
import { users } from './schema';
import { db } from 'db/db';
import { desc, eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { response } from 'express';

// const got = require('got');
// import * as got from 'got';
// import { type } from '../../../../client/src/store/store';

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

    // 로그인 타입
    const loginType = await db
      .select({ login_type: users.login_type })
      .from(users)
      .where(eq(users.userid_num, userid_num));

    console.log('loginType', loginType);
    console.log('getMyPage service userInfo > ', userInfo);
    console.log('getMyPage service file > ', file);
    return { userInfo, file, loginType };
  };

  // 프로필 수정
  patchMyPage = async (userid_num: number, file: string, body: any) => {
    const { nickname, currentPassword, changePassword } = body;
    console.log('file >>>> ', file);
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

    if (checkPassword) {
      // 비밀번호 O, 이미지 O
      if (changePassword) {
        console.log('비밀번호 O, 이미지 O');
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
      } else if (changePassword.length !== 0 && file.length == 0) {
        // 비밀번호 O, 프로필 이미지 X
        console.log('비밀번호 O, 이미지 X');

        const newPassword = await bcrypt.hash(changePassword, 10);
        const userInfo = await db
          .update(users)
          .set({ password: newPassword, nickname: nickname })
          .where(eq(users.userid_num, userid_num));
        isUser = true;
        return { userInfo, file, isUser };
      } else if (changePassword.length == 0 && file.length !== 0) {
        // 비밀번호 X, 프로필 이미지 O
        console.log('비밀번호 X, 이미지 O');

        const userInfo = await db
          .update(users)
          .set({
            nickname: nickname,
            profile_img: filename,
          })
          .where(eq(users.userid_num, userid_num));
        isUser = true;
        return { userInfo, file, isUser };
      } else {
        // 비밀번호 X, 프로필 X
        console.log('비밀번호 x, 이미지 x');

        const userInfo = await db
          .update(users)
          .set({
            nickname: nickname,
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

  async rank() {
    // 상위 3명의 랭크 표시
    const topRank = await db
      .select({
        name: users.name,
        nickname: users.nickname,
        score_num: users.score_num,
      })
      .from(users)
      .orderBy(desc(users.score_num))
      .limit(3);

    return topRank;
  }

  async myRank(userid_num: number) {
    const allRank = await db
      .select({
        userid_num: users.userid_num,
        score_num: users.score_num,
      })
      .from(users)
      .orderBy(desc(users.score_num));

    // 내가 몇번 째 인덱스에 있는지
    const findMe = allRank.findIndex((rank) => rank.userid_num === userid_num);

    const myRank = findMe + 1;

    return myRank;
  }
}
