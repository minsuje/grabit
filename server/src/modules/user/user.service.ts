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
  duplicateCheck = async (userid: string) => {
    console.log(userid);
    const checkid = await db
      .select({ userid: users.userid })
      .from(users)
      .where(eq(users.userid, userid));
    console.log(checkid);
    if (checkid.length > 0) {
      return { msg: '이미 존재하는 아이디입니다.' };
    } else {
      return { msg: '사용가능한 아이디입니다.' };
    }
  };

  // 신규유저 생성
  createNewUser = async (login_type: any, createUserDto: CreateUserDto) => {
    let {
      userid,
      social_userid,
      password,
      name,
      nickname,
      profile_img,
      score_num,
      carrot,
    } = createUserDto;
    if (profile_img === '') profile_img = null;

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
      carrot: carrot,
    };
    const checkUser = await db
      .select()
      .from(users)
      .where(eq(users.userid, userid));

    let isLogins = false;
    if (checkUser.length !== 0) {
      const isLogins = false;
      return isLogins;
    } else {
      const CUser = await db.insert(users).values(userInfo);
      return (isLogins = true);
    }
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
        carrot: users.carrot,
      })
      .from(users)
      .where(eq(users.userid_num, userid_num));

    const checkNum = await db
      .select({ userid: users.userid })
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
    let preInfo: any = await db
      .select()
      .from(users)
      .where(eq(users.userid_num, userid_num));
    preInfo = preInfo[0];
    let filename;
    if (file) {
      filename = file.split('/')[3].split('?')[0];
    } else {
      if (preInfo.profile_img !== null) filename = null;
    }

    let isUser = false;
    const myDbPassword = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.userid_num, userid_num));

    const myPassword = myDbPassword[0];

    if (login_type === 'normal') {
      const checkPassword = await bcrypt.compare(
        currentPassword,
        myPassword.password,
      );
      if (checkPassword) {
        // 비밀번호 O, 이미지 O
        if (changePassword) {
          // 비밀번호 변경함
          const newPassword = await bcrypt.hash(changePassword, 10);
          if (filename) {
            const userInfo = await db
              .update(users)
              .set({
                password: newPassword,
                nickname: nickname,
                profile_img: filename,
              })
              .where(eq(users.userid_num, userid_num))
              .returning();
            isUser = true;
          }
          const userInfo = await db
            .update(users)
            .set({ password: newPassword, nickname: nickname })
            .where(eq(users.userid_num, userid_num))
            .returning();
          isUser = true;
          return { userInfo, file, isUser };
        } else {
          // 비밀 번호 변경 안함
          if (filename) {
            // 비밀번호 X, 프로필 이미지 O
            const userInfo = await db
              .update(users)
              .set({
                nickname: nickname,
                profile_img: filename,
              })
              .where(eq(users.userid_num, userid_num))
              .returning();

            isUser = true;
            return { userInfo, file, isUser };
          } else {
            // 비밀번호 X, 프로필 X
            const userInfo = await db
              .update(users)
              .set({
                nickname: nickname,
              })
              .where(eq(users.userid_num, userid_num))
              .returning();
            isUser = true;
            return { userInfo, file, isUser };
          }
        }
      } else {
        return { msg: '비밀번호를 다시 한번 확인해 주세요', isUser };
      }
    }

    if (login_type === 'kakao') {
      if (file.length !== 0 || file !== null) {
        // 이미지 O, 닉네임 O
        const userInfo = await db
          .update(users)
          .set({
            nickname: nickname,
            profile_img: filename,
          })
          .where(eq(users.userid_num, userid_num));
        isUser = true;
        return { userInfo, file, isUser };
      } else if (file.length === 0 || file === null) {
        // 이미지 X
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
      .select({ userid: users.userid, name: users.name, carrot: users.carrot })
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
      console.error(e);
    }
  };

  updateMoney = async (amount: number, userid_num: number) => {
    let carrots: number;
    if (Number(amount) === 1000) {
      carrots = 850;
    } else if (Number(amount) === 2000) {
      carrots = 1700;
    } else if (Number(amount) === 5000) {
      carrots = 4800;
    } else if (Number(amount) === 10000) {
      carrots = 10000;
    }
    const userInfo = await db
      .update(users)
      .set({ carrot: sql`${users.carrot} + ${carrots}` })
      .where(eq(users.userid_num, userid_num))
      .returning();

    const userAccount = await db
      .insert(account)
      .values({
        transaction_description: 'charge/carrot',
        transaction_type: 'carrot/deposit',
        transaction_amount: carrots,
        status: false,
        userid_num: userid_num,
      })
      .returning();
    return { userInfo, userAccount };
  };

  // 랭크
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

  // 내 랭킹
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

  // 출금 신청
  async requestWithdraw(userid_num: number, change: any) {
    const { money, bank_num, bank_name, name } = change;
    // 유저 정보 확인
    const checkMoney = await db
      .select({ carrot: users.carrot, name: users.name })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    if (checkMoney[0].name === name) {
      let myAccountMoney = checkMoney[0].carrot;
      // 1만원 이상 출금 가능
      if (myAccountMoney >= 10000) {
        const withdraw = await db
          .update(users)
          .set({ carrot: sql`${users.carrot} - ${money}` })
          .where(eq(users.userid_num, userid_num))
          .returning();

        const account_insert = await db
          .insert(account)
          .values({
            transaction_amount: money,
            transaction_description: 'money/withdarw',
            transaction_type: 'carrot/withdraw',
            status: false,
            account_info: [bank_name, bank_num],
            userid_num: userid_num,
          })
          .returning();

        return { withdraw, account_insert, msg: '출금 신청 완료' };
      } else {
        return { msg: '캐럿이 부족합니다.' };
      }
    } else {
      return {
        msg: '예금주 명이 계정과 일치하지 않습니다. 다시 한번 확인해 주세요',
      };
    }
  }
}
