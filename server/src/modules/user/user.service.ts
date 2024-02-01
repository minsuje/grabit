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
    return { userInfo, file };
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

    console.log('user service checkPassword >>', checkPassword);
    console.log('user service profile_img', file);
    // console.log('user service profile_img', profile_img);

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
            profile_img: file,
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
            profile_img: file,
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

  // 결제
  // tossUrl = 'https://api.tosspayments.com/v1/payments/';
  // async successPay(paymentDTO, res) {
  //   console.log('user service paymentDTO >>>> ', paymentDTO);

  //   const { orderId, amount, paymentKey } = paymentDTO;
  //   // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
  //   // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
  //   const widgetSecretKey = process.env.TOSS_SECRET_KEY;
  //   const encryptedSecretKey =
  //     'Basic ' + Buffer.from(widgetSecretKey + ':').toString('base64');

  //   // 결제를 승인하면 결제수단에서 금액이 차감돼요.
  //   axios
  //     .post('https://api.tosspayments.com/v1/payments/confirm', {
  //       headers: {
  //         Authorization: encryptedSecretKey,
  //         'Content-Type': 'application/json',
  //       },
  //       json: {
  //         orderId: orderId,
  //         amount: amount,
  //         paymentKey: paymentKey,
  //       },
  //       responseType: 'json',
  //     })
  //     .then(function (response) {
  //       // 결제 성공 비즈니스 로직을 구현하세요.
  //       console.log(response);
  //       // res.status(response.statusCode).json(response.body);
  //     })
  //     .catch(function (error) {
  //       // 결제 실패 비즈니스 로직을 구현하세요.
  //       console.log(error.response.body);
  //       // res.status(error.response.statusCode).json(error.response.body);
  //     });
  // }

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
