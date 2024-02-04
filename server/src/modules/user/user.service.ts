import { Injectable } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { PaymentDTO } from './dto/paymentsDto';
import { account, users } from './schema';
import { db } from 'db/db';
import { and, desc, eq, or, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { response } from 'express';
import { challenge } from '../challenge/schema';
import { isAfter } from 'date-fns';
import { friend } from '../friend/schema';

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

    return { userInfo, file, loginType };
  };

  // 다른 사람 프로필 조회
  getProfilePage = async (
    login_userid_num: number,
    userid: string,
    file: object,
  ) => {
    // userid로 userid_num 찾기
    let userid_num: any = await db
      .select({ userid_num: users.userid_num })
      .from(users)
      .where(eq(users.userid, userid));
    userid_num = userid_num[0].userid_num;
    // - 랭킹 조회
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

    // - 전적 조회
    // 모든 챌린지 찾기
    const challengeAll = await db.select().from(challenge);
    let myChallenge = [];
    for (let i = 0; i < challengeAll.length; i++) {
      for (let j = 0; j < challengeAll[i].challenger_userid_num.length; j++) {
        if (
          challengeAll[i].challenger_userid_num[j].userid_num === userid_num &&
          challengeAll[i].challenger_userid_num[j].isAccept === true
        ) {
          myChallenge.push(challengeAll[i]);
        }
      }
    }
    let history = [];
    let today = new Date()
      .toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
      .split(',')[0];
    for (let i = 0; i < myChallenge.length; i++) {
      if (
        isAfter(
          today,
          myChallenge[i].authentication_end_date
            .toLocaleString('en-US', {
              timeZone: 'Asia/Seoul',
            })
            .split(',')[0],
        )
      )
        history.push(myChallenge[i]);
    }
    let win = 0, // 승리 횟수
      lose = 0; // 패배 횟수
    const total = history.length; // 총 챌린지 횟수
    for (let i = 0; i < history.length; i++) {
      if (
        history[i].winner_userid_num !== null &&
        history[i].winner_userid_num.includes(Number(userid_num))
      )
        win++;
      else lose++;
    }

    let finalHistory = {
      total: total,
      win: win,
      lose: lose,
    };

    // 친구 상태 조회
    let friendStatus = '친구 신청';
    let friends = [];
    const friendStatus1 = await db
      .select()
      .from(friend)
      .where(
        or(
          eq(friend.userid_num, userid_num),
          eq(friend.other_userid_num, userid_num),
        ),
      );
    for (let i = 0; i < friendStatus1.length; i++) {
      friends.push(friendStatus1[i]);
    }
    const friendStatus2 = await db
      .select()
      .from(friend)
      .where(
        or(
          eq(friend.userid_num, login_userid_num),
          eq(friend.other_userid_num, login_userid_num),
        ),
      );
    for (let i = 0; i < friendStatus2.length; i++) {
      friends.push(friendStatus2[i]);
    }
    // console.log('friends > ', friends);

    for (let i = 0; i < friends.length; i++) {
      if (friends[i].userid_num === login_userid_num) {
        if (friends[i].other_userid_num === userid_num) {
          if (friends[i].is_friend === true) {
            friendStatus = '친구입니다.';
          } else friendStatus = '친구 신청 해놓고 대기 중';
        }
      } else if (friends[i].other_userid_num === login_userid_num) {
        if (friends[i].userid_num === userid_num) {
          if (friends[i].is_friend === true) {
            friendStatus = '친구입니다.';
          } else friendStatus = '상대가 친구 신청 해놓은거 수락바람';
        }
      }
    }

    return { userid, file, myRank, finalHistory, friendStatus };
  };

  // 프로필 수정
  patchMyPage = async (
    userid_num: number,
    file: string,
    body: any,
    login_type: string,
  ) => {
    const { nickname, currentPassword, changePassword } = body;
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

    if (login_type === 'normal') {
      if (checkPassword) {
        // 비밀번호 O, 이미지 O
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
        } else if (changePassword.length !== 0 && file.length == 0) {
          // 비밀번호 O, 프로필 이미지 X

          const newPassword = await bcrypt.hash(changePassword, 10);
          const userInfo = await db
            .update(users)
            .set({ password: newPassword, nickname: nickname })
            .where(eq(users.userid_num, userid_num));
          isUser = true;
          return { userInfo, file, isUser };
        } else if (changePassword.length == 0 && file.length !== 0) {
          // 비밀번호 X, 프로필 이미지 O

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
    }

    if (login_type === 'kakao') {
      if (file.length !== 0) {
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
        const userInfo = await db
          .update(users)
          .set({
            nickname: nickname,
          })
          .where(eq(users.userid_num, userid_num));
        isUser = true;
        return { userInfo, file, isUser };
      }
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

  payment = async (userid_num: number) => {
    const user = await db
      .select({ userid: users.userid, name: users.name, money: users.money })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    return { user };
  };

  tossPayment = async (paymentDTO: PaymentDTO) => {
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
        amount: response.data.totalAmount,
      };
    } catch (e) {
      console.log('토스페이먼츠 에러', e);
    }
  };

  updateMoney = async (amount: number, userid_num: number) => {
    let carrot: number;
    if (Number(amount) === 1000) {
      carrot = 850;
    } else if (Number(amount) === 2000) {
      carrot = 1700;
    } else if (Number(amount) === 5000) {
      carrot = 4800;
    } else if (Number(amount) === 10000) {
      carrot = 10000;
    }
    const userInfo = await db
      .update(users)
      .set({ money: sql`${users.money} + ${carrot}` })
      .where(eq(users.userid_num, userid_num))
      .returning();

    const userAccount = await db
      .insert(account)
      .values({
        transaction_description: 'charge/carrot',
        transaction_type: 'carrot/deposit',
        transaction_amount: carrot,
        status: false,
        userid_num: userid_num,
      })
      .returning();
    return { userInfo, userAccount };
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
