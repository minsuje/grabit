import { Injectable } from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import {
  challenge,
  authentication,
  authentication_img_emoticon,
} from './schema';
import { account, score, users } from '../user/schema';
import { notification } from '../notification/schema';
import { db } from '../../../db/db';
import { eq, not, and, desc, arrayOverlaps, sql, AnyTable } from 'drizzle-orm';
import {
  isBefore,
  isAfter,
  addHours,
  addMonths,
  subDays,
  differenceInDays,
  addDays,
} from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';
import { datetime } from 'drizzle-orm/mysql-core';

@Injectable()
export class ChallengeService {
  // 챌린지 생성
  newChallenge = async (
    login_userid_num: number,
    login_nickname: string,
    body: ChallengeDto,
  ) => {
    let {
      challenge_name,
      is_public,
      topic,
      auth_keyword,
      challenger_userid_num,
      goal_money,
      term,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    } = body;

    let challenger_userid_num2 = [];
    for (let i = 0; i < challenger_userid_num.length; i++) {
      challenger_userid_num2.push(challenger_userid_num[i]);
    }
    challenger_userid_num2.push(login_userid_num);

    // 챌린지 생성하는 유저 정보 찾아오기
    let userMoney: any = await db
      .select({ carrot: users.carrot })
      .from(users)
      .where(eq(users.userid_num, login_userid_num));
    userMoney = userMoney[0].carrot;

    let hasMoney = false;

    // 내기 금액보다 유저의 잔고가 많아야 챌린지 생성 가능
    if (userMoney >= goal_money) {
      let challengers = [];
      for (let i = 0; i < challenger_userid_num2.length; i++) {
        if (Number(challenger_userid_num2[i]) !== login_userid_num) {
          challengers.push({
            userid_num: challenger_userid_num2[i],
            isAccept: false,
            resultConfirm: false,
          });
        } else {
          challengers.push({
            userid_num: challenger_userid_num2[i],
            isAccept: true,
            resultConfirm: false,
          });
        }
      }

      // 챌린지 테이블에 추가하기
      let newChallenge: any = await db
        .insert(challenge)
        .values({
          challenge_name,
          userid_num: login_userid_num,
          is_public,
          topic,
          auth_keyword,
          challenger_userid_num: challengers,
          goal_money,
          term,
          authentication_start_date: new Date(authentication_start_date),
          authentication_end_date: new Date(authentication_end_date),
          authentication_start_time,
          authentication_end_time,
        })
        .returning(); // 생성하고 바로 객체로 반환받아서 값 사용할 수 있음
      newChallenge = newChallenge[0];

      // notification 테이블에 추가하기
      const challengeNotification = [];
      let noti: any;
      for (let i = 0; i < challenger_userid_num2.length; i++) {
        // 챌린지를 생성하는 유저를 제외하고 알람 보내주기
        if (Number(challenger_userid_num2[i]) !== login_userid_num) {
          noti = await db.insert(notification).values({
            userid_num: Number(challenger_userid_num2[i]),
            reference_id: newChallenge.challenge_id,
            message: {
              challengeName: newChallenge.challenge_name,
              inviterName: login_nickname,
            },
            type: 'challenge/create',
            is_confirm: false,
          });
          challengeNotification.push(noti);
        }
      }

      // 챌린지 생성될 때 챌린지 생성하는 유저 money랑 account 계산하기
      const money = await db
        .update(users)
        .set({
          carrot: sql`${users.carrot} - ${newChallenge.goal_money}`,
        })
        .where(eq(users.userid_num, login_userid_num));

      const accountInfo = await db.insert(account).values({
        transaction_description: 'challenge/participation',
        transaction_type: 'carrot/withdraw',
        transaction_amount: newChallenge.goal_money,
        status: false,
        userid_num: login_userid_num,
      });

      hasMoney = true;

      return { newChallenge, challengeNotification, hasMoney };
    } else if (goal_money < 0) {
      return { msg: '마이너스 값은 입력이 불가능 합니다.', hasMoney };
    } else {
      return { msg: '캐럿이 부족합니다.', hasMoney };
    }
  };

  // 챌린지 수락
  challengeAccept = async (userid_num: number, challenge_id: number) => {
    // 챌린지 생성하는 유저 정보 찾아오기
    let userMoney: any = await db
      .select({ carrot: users.carrot })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    userMoney = userMoney[0].carrot;
    const challengeWait: any = await db
      .select({
        goal_money: challenge.goal_money,
        challenger_userid_num: challenge.challenger_userid_num,
      })
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));

    if (userMoney >= challengeWait[0].goal_money) {
      for (let i = 0; i < challengeWait.length; i++) {
        if (challengeWait[i].userid_num === userid_num) {
          challengeWait[i].isAccept = true;
        }
      }
      // 수락하면 유저 테이블에서 money 수정하고 , account 기록 남겨주기
      // 챌린지 수락할 때 챌린지 유저 money랑 account 계산하기
      const money = await db
        .update(users)
        .set({
          carrot: sql`${users.carrot} - ${challengeWait[0].goal_money}`,
        })
        .where(eq(users.userid_num, userid_num));

      const accountInfo = await db.insert(account).values({
        transaction_description: 'challenge/participation',
        transaction_type: 'carrot/withdraw',
        transaction_amount: challengeWait[0].goal_money,
        status: false,
        userid_num: userid_num,
      });

      return await db
        .update(challenge)
        .set({
          challenger_userid_num: challengeWait[0].challenger_userid_num,
        })
        .where(eq(challenge.challenge_id, challenge_id));
    } else
      return {
        msg: '캐럿이 부족합니다.',
      };
  };

  // 챌린지 거절
  challengeReject = async (
    login_userid_num: number,
    login_nickname: string,
    challenge_id: number,
  ) => {
    let challengeWait: any = await db
      .select({ challenger_userid_num: challenge.challenger_userid_num })
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
    challengeWait = challengeWait[0].challenger_userid_num;
    let newChallengeWait = [];
    for (let i = 0; i < challengeWait.length; i++) {
      if (challengeWait[i].userid_num !== login_userid_num) {
        newChallengeWait.push(challengeWait[i]);
      }
    }

    const updateChallenge = await db
      .update(challenge)
      .set({
        challenger_userid_num: newChallengeWait,
      })
      .where(eq(challenge.challenge_id, challenge_id))
      .returning();

    let noti: any;
    noti = await db.insert(notification).values({
      userid_num: updateChallenge[0].userid_num,
      reference_id: updateChallenge[0].challenge_id,
      message: {
        challengeName: updateChallenge[0].challenge_name,
        rejectorName: login_nickname,
      },
      type: `challenge/reject/${login_userid_num}`,
      is_confirm: false,
    });

    if (updateChallenge[0].challenger_userid_num.length == 0) {
      noti = await db.insert(notification).values({
        userid_num: updateChallenge[0].userid_num,
        reference_id: updateChallenge[0].challenge_id,
        message: { challengeName: updateChallenge[0].challenge_name },
        type: 'challenge/delete/noChallenger',
        is_confirm: false,
      });
    }

    return updateChallenge;
  };

  // 챌린지 목록
  challengeList = async (userid_num: number) => {
    const today = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const challengeAll = await db.select().from(challenge);
    let myChallenge = [];

    for (let i = 0; i < challengeAll.length; i++) {
      for (let j = 0; j < challengeAll[i].challenger_userid_num.length; j++) {
        if (
          challengeAll[i].challenger_userid_num[j].userid_num === userid_num
        ) {
          myChallenge.push(challengeAll[i]);
        }
      }
    }
    // 참여중인 챌린지
    let ingMyChallenge = [];
    for (let i = 0; i < myChallenge.length; i++) {
      if (
        isBefore(myChallenge[i].authentication_start_date, new Date()) &&
        isAfter(myChallenge[i].authentication_end_date, new Date())
      ) {
        ingMyChallenge.push(myChallenge[i]);
      }
    }

    // 참가 예정 챌린지
    let preMyChallenge = [];
    for (let i = 0; i < myChallenge.length; i++) {
      if (isAfter(myChallenge[i].authentication_start_date, new Date())) {
        preMyChallenge.push(myChallenge[i]);
      }
    }

    // 종료된 챌린지
    let endedMyChallenge = [];
    for (let i = 0; i < myChallenge.length; i++) {
      if (isBefore(myChallenge[i].authentication_end_date, new Date())) {
        for (let j = 0; j < myChallenge[i].challenger_userid_num.length; j++) {
          if (
            myChallenge[i].challenger_userid_num[j].userid_num === userid_num
          ) {
            if (myChallenge[i].challenger_userid_num[j].resultConfirm === false)
              endedMyChallenge.push(myChallenge[i]);
          }
        }
      }
    }

    // 열려있는 챌린지
    const publicChallengeAll = await db
      .select()
      .from(challenge)
      .where(eq(challenge.is_public, true));
    let publicChallenge = [];
    for (let i = 0; i < publicChallengeAll.length; i++) {
      for (
        let j = 0;
        j < publicChallengeAll[i].challenger_userid_num.length;
        j++
      ) {
        if (
          publicChallengeAll[i].challenger_userid_num[j].userid_num !==
          userid_num
        ) {
          publicChallenge.push(publicChallengeAll[i]);
        }
      }
    }
    let prePublicChallenge = [];
    for (let i = 0; i < publicChallenge.length; i++) {
      if (isAfter(publicChallenge[i].authentication_start_date, new Date())) {
        prePublicChallenge.push(publicChallenge[i]);
      }
    }
    return {
      ingMyChallenge,
      preMyChallenge,
      endedMyChallenge,
      prePublicChallenge,
    };
  };

  // 인기 있는 챌린지 주제
  getPopularChallenge = async () => {
    const topics = await db.select({ topic: challenge.topic }).from(challenge);
    let topicCounts = [
      { name: '운동', count: 0 },
      { name: '셀프케어', count: 0 },
      { name: '독서', count: 0 },
      { name: '학습', count: 0 },
      { name: '취미', count: 0 },
      { name: '생활습관', count: 0 },
      { name: '저축', count: 0 },
    ];
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].topic === '운동') topicCounts[0].count++;
      else if (topics[i].topic === '셀프케어') topicCounts[1].count++;
      else if (topics[i].topic === '독서') topicCounts[2].count++;
      else if (topics[i].topic === '학습') topicCounts[3].count++;
      else if (topics[i].topic === '취미') topicCounts[4].count++;
      else if (topics[i].topic === '생활습관') topicCounts[5].count++;
      else if (topics[i].topic === '저축') topicCounts[6].count++;
    }
    // count 기준으로 내림차순 정렬
    topicCounts.sort((a, b) => b.count - a.count);
    const popularTopic = topicCounts.slice(0, 3);
    const popularTopics = popularTopic.map((topic) => topic.name);
    const top1 = await db
      .select()
      .from(challenge)
      .where(eq(challenge.topic, popularTopics[0]))
      .orderBy(desc(challenge.created_at))
      .limit(3);
    const top2 = await db
      .select()
      .from(challenge)
      .where(eq(challenge.topic, popularTopics[1]))
      .orderBy(desc(challenge.created_at))
      .limit(3);
    const top3 = await db
      .select()
      .from(challenge)
      .where(eq(challenge.topic, popularTopics[2]))
      .orderBy(desc(challenge.created_at))
      .limit(3);
    return { popularTopics, top1, top2, top3 };
  };

  // 챌린지 상세 정보 보기
  challengeDetail = async (
    login_userid_num: number,
    challenge_id: number,
    file: any,
  ) => {
    if (file !== null) {
      // 존재 하지 않는 챌린지에 대한 예외 처리
      const { urls, challengers } = file;
      const challengeDetail = await db
        .select()
        .from(challenge)
        .where(eq(challenge.challenge_id, challenge_id));

      // 로그인한 유저가 챌린지 인증 가능한 상태인지 확인
      let isAcceptable: boolean = true;
      let auth_num = 0;

      // 해당 챌린지에서 로그인한 유저가 인증한 내역을 모두 찾아서 배열로 저장
      const myAuth = await db
        .select()
        .from(authentication)
        .where(
          and(
            eq(authentication.challenge_id, challengeDetail[0].challenge_id),
            eq(authentication.userid_num, login_userid_num),
          ),
        );
      let today = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
      });
      today = today.split(',')[0];
      const year: number = Number(today.split('/')[2]);
      const month: number = Number(today.split('/')[0]);
      const day: number = Number(today.split('/')[1]);

      const period = differenceInDays(
        challengeDetail[0].authentication_end_date,
        challengeDetail[0].authentication_start_date,
      );

      let firstWeek;
      let lastWeek;
      const startDate = challengeDetail[0].authentication_start_date
        .toLocaleString('en-US', {
          timeZone: 'Asia/Seoul',
        })
        .split(',')[0]
        .split('/');
      const endDate = challengeDetail[0].authentication_end_date
        .toLocaleString('en-US', {
          timeZone: 'Asia/Seoul',
        })
        .split(',')[0];

      // 일주일씩 체크하는 기간이 2주이면 종료날짜가 주가 끝나는 두번째 시점
      if (period >= 14) {
        lastWeek = addDays(
          new Date(
            Number(startDate[2]),
            Number(startDate[0]) - 1,
            Number(startDate[1]),
          ),
          14,
        )
          .toLocaleString('en-US', {
            timeZone: 'Asia/Seoul',
          })
          .split(',')[0];
      }

      // 인증 기간이 일주일이거나 두 번째 일 때 첫 번째 인증 체크 시점
      if (period >= 7) {
        firstWeek = addDays(
          new Date(
            Number(startDate[2]),
            Number(startDate[0]) - 1,
            Number(startDate[1]),
          ),
          7,
        )
          .toLocaleString('en-US', {
            timeZone: 'Asia/Seoul',
          })
          .split(',')[0];
      }

      if (challengeDetail[0].term == 7) {
        // 매일 인증
        let last = myAuth.length;
        // 인증 첫 날에 대한 확인
        if (last > 0) {
          let lastAuth = myAuth[last - 1].created_at
            .toLocaleString('en-US', {
              timeZone: 'Asia/Seoul',
            })
            .split(',')[0];
          let yesterday: any = subDays(new Date(year, month - 1, day), 1);
          yesterday = yesterday
            .toLocaleString('en-US', {
              timeZone: 'Asia/Seoul',
            })
            .split(',')[0];
          if (lastAuth != yesterday) isAcceptable = false;
        }
      } else if (challengeDetail[0].term == 3) {
        // 주 3회 인증
        if (today === firstWeek) {
          if (myAuth.length < 3) isAcceptable = false;
        }
        if (today === lastWeek) {
          if (myAuth.length < 6) isAcceptable = false;
        }
      } else if (challengeDetail[0].term) {
        // 주 5회 인증
        if (today === firstWeek) {
          if (myAuth.length < 5) isAcceptable = false;
        }
        if (today === lastWeek) {
          if (myAuth.length < 10) isAcceptable = false;
        }
      }

      return { challengeDetail, challengers, urls, isAcceptable };
    } else return { msg: '존재하지 않는 챌린지입니다.' };
  };

  // 챌린지 수정 페이지 보기
  getChallengeEdit = async (challenge_id: number) => {
    const challengeDetail = await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));

    return challengeDetail;
  };

  // 챌린지 수정하기
  patchChallengeEdit = async (body: ChallengeDto, challenge_id: number) => {
    const {
      challenge_name,
      topic,
      auth_keyword,
      goal_money,
      term,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    } = body;

    let updateChallenge: any = await db
      .update(challenge)
      .set({
        challenge_name: challenge_name,
        topic: topic,
        auth_keyword: auth_keyword,
        goal_money: goal_money,
        term: term,
        authentication_start_date: new Date(authentication_start_date),
        authentication_end_date: new Date(authentication_end_date),
        authentication_start_time: authentication_start_time,
        authentication_end_time: authentication_end_time,
        updated_at: new Date(),
      })
      .where(eq(challenge.challenge_id, challenge_id))
      .returning();

    updateChallenge = updateChallenge[0];

    for (let i = 0; i < updateChallenge.challenger_userid_num.length; i++) {
      if (
        updateChallenge.userid_num !==
        updateChallenge.challenger_userid_num[i].userid_num
      ) {
        let noti = await db.insert(notification).values({
          userid_num: updateChallenge.challenger_userid_num[i].userid_num,
          reference_id: challenge_id,
          message: { challengeName: updateChallenge.challenge_name },
          type: 'challenge/modify',
          is_confirm: false,
        });
      }
    }
    return updateChallenge;
  };

  // 챌린지 삭제하기
  deleteChallengeEdit = async (challenge_id: number) => {
    let challengeInfo: any = await db
      .select({
        challenge_id: challenge.challenge_id,
        challenge_name: challenge.challenge_name,
        userid_num: challenge.userid_num,
        challenger_userid_num: challenge.challenger_userid_num,
      })
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
    challengeInfo = challengeInfo[0];

    for (let i = 0; i < challengeInfo.challenger_userid_num.length; i++) {
      if (
        challengeInfo.userid_num !==
        challengeInfo.challenger_userid_num[i].userid_num
      ) {
        let noti = await db.insert(notification).values({
          userid_num: challengeInfo.challenger_userid_num[i].userid_num,
          reference_id: challenge_id,
          message: {
            challengeName: challengeInfo.challenge_name,
          },
          type: 'challenge/delete/byOwner',
          is_confirm: false,
        });
      }
    }

    return await db
      .delete(challenge)
      .where(eq(challenge.challenge_id, challenge_id));

    // 일단 알림만 보내주고 30일 이후에 db에서 삭제해줘야 함. -> 알림 조회될 때 없으면 충돌 발생하기 때문
    // return 'success';
  };

  // 챌린지 인증하기
  newChallengeAuth = async (
    login_userid_num: number,
    challenge_id: number,
    file: string,
  ) => {
    if (file) {
      let fileName: any = file.split('?')[0].split('.com/')[1];

      await db.insert(authentication).values({
        challenge_id: challenge_id,
        userid_num: login_userid_num,
        authentication_img: fileName,
        authentication_status: false,
      });
      return file;
    } else
      return {
        msg: '이미 인증하신 유저입니다.',
      };
  };

  // 테스트 (s3 이미지 get 요청)
  // 챌린지 인증사진 상세 보기
  getChallengeAuth = async (
    challenge_id: number,
    authentication_id: number,
    fileUrl: any,
  ) => {
    const emoticon = await db
      .select()
      .from(authentication_img_emoticon)
      .where(
        and(
          eq(authentication_img_emoticon.authentication_id, authentication_id),
        ),
      );
    return { fileUrl, emoticon };
  };

  // 챌린지 인증사진에 대한 이모티콘 취소 요청
  deleteChallengeAuthEmoticon = async (
    challenge_id: number,
    authentication_id: number,
    authentication_img_emoticon_id: number,
    userid_num: number,
  ) => {
    return await db
      .delete(authentication_img_emoticon)
      .where(
        and(
          eq(
            authentication_img_emoticon.authentication_img_comment_emoticon,
            authentication_img_emoticon_id,
          ),
          eq(
            authentication_img_emoticon.authentication_img_comment_userid_num,
            userid_num,
          ),
        ),
      );
  };

  // 챌린지 인증사진에 대한 이모티콘 요청
  newChallengeAuthEmoticon = async (
    login_userid_num: number,
    body: any,
    challenge_id: number,
    authentication_id: number,
  ) => {
    const { authentication_img_comment_emoticon } = body;
    return await db.insert(authentication_img_emoticon).values({
      authentication_id,
      authentication_img_comment_userid_num: login_userid_num,
      authentication_img_comment_emoticon,
    });
  };

  // 테스트 (s3 이미지 patch 요청)
  patchChallengeAuth = async (
    challenge_id: number,
    authentication_id: number,
    file: string,
  ) => {
    let fileName: any = file.split('?')[0].split('.com/')[1];

    const updateImg = await db
      .update(authentication)
      .set({
        authentication_img: fileName,
      })
      .where(eq(authentication.authentication_id, authentication_id));
    return file;
  };

  // 테스트 (s3 이미지 delete 요청)
  deleteChallengeAuth = async (
    challenge_id: number,
    authentication_id: number,
  ) => {
    return await db
      .delete(authentication)
      .where(eq(authentication.authentication_id, authentication_id));
  };

  // 챌린지 히스토리 조회
  getChallengeHistory = async (userid_num: number) => {
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
      ) {
        history.push(myChallenge[i]);
      }
    }
    for (let i = 0; i < history.length; i++) {
      let challenger = history[i].challenger_userid_num;
      for (let j = 0; j < challenger.length; j++) {
        let nickname: any = await db
          .select({ nickname: users.nickname })
          .from(users)
          .where(eq(users.userid_num, challenger[j].userid_num));
        nickname = nickname[0].nickname;
        history[i].challenger_userid_num[j] = {
          ...challenger[j],
          nickname: nickname,
        };
      }
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
    return { history, total, win, lose };
  };

  // challenge 승자 업데이트
  async challengeWinner(
    winner: any,
    challenge_id: number,
    userid_num: number,
    challengerInfo: any,
  ) {
    // "resultConfirm : true"로 바꿔주기
    let challengeInfo: any;

    // challenge userid num( 참가자들 )
    let preConfirmData: any = await db
      .select({ challenger_userid_num: challenge.challenger_userid_num })
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
    preConfirmData = preConfirmData[0].challenger_userid_num;

    console.log('preConfirmData>>>> ', preConfirmData);
    let confirmData: any = [];
    for (let i = 0; i < preConfirmData.length; i++) {
      if (preConfirmData[i].userid_num === userid_num) {
        confirmData.push({
          ...preConfirmData[i],
          resultConfirm: true,
        });
      } else
        confirmData.push({
          ...preConfirmData[i],
        });
    }
    console.log('confirm >> ', confirmData);
    // 챌린지에 대한 정보 조회
    challengeInfo = await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
    challengeInfo = challengeInfo[0];

    console.log('preConfirm > > ', preConfirmData[0]);
    let user: any = {};
    for (let i = 0; i < preConfirmData.length; i++) {
      user = preConfirmData[i];
      if (user.userid_num === userid_num) {
        // 참가 결과를 확인 안했다면
        // if (user.resultConfirm === false) {
        //   let updateConfirm = await db
        //     .update(challenge)
        //     .set({ challenger_userid_num: confirmData })
        //     .where(eq(challenge.challenge_id, challenge_id))
        //     .returning();
        if (user.resultConfirm === true) {
          let updateConfirm = await db
            .update(challenge)
            .set({ challenger_userid_num: confirmData })
            .where(eq(challenge.challenge_id, challenge_id))
            .returning();

          console.log(winner);
          let winners = winner.winner_userid_num;

          console.log('winners >', winners);

          // 총 상금
          let totalMoney = winner.total_money;

          console.log('total Money > ', totalMoney);

          // 몇명이 참가했는지 찾기
          let totalPeople: any = await db
            .select({ challenger_userid_num: challenge.challenger_userid_num })
            .from(challenge)
            .where(eq(challenge.challenge_id, challenge_id));
          totalPeople = totalPeople[0].challenger_userid_num;
          totalPeople = totalPeople.length;

          console.log('total people >>', totalPeople);

          // 1인당 제출한 금액
          let onePerson = totalMoney / totalPeople;

          console.log('onePerson >', onePerson);

          // Check the user table money
          let checkMoney = await db
            .select({ carrot: users.carrot })
            .from(users)
            .where(eq(users.userid_num, userid_num));

          console.log('check money > ', checkMoney);

          const userMoney = checkMoney[0].carrot;

          console.log(userMoney);

          let win = 'none';
          let carrot: number;

          // 이긴 사람이 없을 때
          if (winners === undefined || winners.length === 0) {
            console.log('이긴 사람이 없을 떄');
            win = 'none';
            const loseScore = await db.insert(score).values({
              userid_num: userid_num,
              score_description: '챌린지 실패...',
              score_type: 'lose',
              score: -50,
            });

            // 유저가 가진 점수 확인 하기
            const checkScore = await db
              .select({ score_num: users.score_num })
              .from(users)
              .where(eq(users.userid_num, userid_num));

            const myScore = checkScore[0].score_num;
            console.log(myScore);

            // 유저의 점수 감소 시키기 ( 50 이하면 0점으로 )
            if (myScore > 50) {
              const addUserTable = await db
                .update(users)
                .set({ score_num: sql`${users.score_num} - 50` })
                .where(eq(users.userid_num, userid_num));
            } else {
              const addUserTable = await db
                .update(users)
                .set({ score_num: 0 })
                .where(eq(users.userid_num, userid_num));
            }

            console.log('challengerInfo >', challengerInfo);
            // challengerInfo 내역 업데이트(캐럿 추가)
            for (let i = 0; i < challengerInfo.length; i++) {
              challengerInfo[i] = {
                ...challengerInfo[i],
                carrot: -challengeInfo.goal_money,
                score: -50,
              };
            }
            console.log('challengerInfo 2>', challengerInfo);
          } else {
            win = 'someone';

            // 이긴 사람이 있을 때 winner 추가하기
            const addWinner = await db
              .update(challenge)
              .set({ winner_userid_num: winners })
              .where(eq(challenge.challenge_id, challenge_id))
              .returning();

            console.log('winner > ', addWinner);
            // 3.3% 운영 수수료
            const companyCharge = totalMoney * 0.033;

            // 원금에서 수수료를 제외한 금액 반올림
            const leftMoney = Math.round(totalMoney - companyCharge);

            // 모든 이긴 유저 찾기
            let findWinner: any = await db
              .select({ winner_userid_num: challenge.winner_userid_num })
              .from(challenge)
              .where(eq(challenge.challenge_id, challenge_id));

            findWinner = findWinner[0].winner_userid_num;

            // 모든 승자를 조회
            let amIWinner: boolean = false;
            if (winners.includes(userid_num)) {
              amIWinner = true;
            }

            // case 1. 참여한 모든 유저가 이겼다.
            // 원래 돈을 그대로 입금
            if (totalPeople === findWinner.length) {
              // 스코어 증가!
              const addScoreTable = await db.insert(score).values({
                userid_num: userid_num,
                score_description: '챌린지 성공!',
                score_type: 'win',
                score: +100,
              });

              // 유저의 점수 증가 시키기
              const addUserTable = await db
                .update(users)
                .set({ score_num: sql`${users.score_num} + ${100}` })
                .where(eq(users.userid_num, userid_num));

              // 내가 원래 참가 신청한 돈
              const originalMoney: any = totalMoney / findWinner.length;

              // account 에 내역 추가
              const getMoney = await db.insert(account).values({
                userid_num: userid_num,
                transaction_description: 'challenge/success',
                transaction_type: 'carrot/deposit',
                transaction_amount: originalMoney,
                status: false,
              });

              // user 잔고에 돈 입금
              const newMoney = await db
                .update(users)
                .set({ carrot: sql`${users.carrot} + ${originalMoney}` })
                .where(eq(users.userid_num, userid_num));

              // challengerInfo 내역 업데이트(캐럿 추가)
              for (let i = 0; i < challengerInfo.length; i++) {
                challengerInfo[i] = {
                  ...challengerInfo[i],
                  carrot: originalMoney,
                  score: 100,
                };
              }
            } else {
              let divMoney: any;
              if (amIWinner) {
                console.log('모든 유저가 이기지 못함, 나는 이김');
                // case 2. 모든 유저가 이기지 못했다. (but! 나는 이김 )
                // 스코어 증가!
                const addScoreTable = await db.insert(score).values({
                  userid_num: userid_num,
                  score_description: '챌린지 성공!',
                  score_type: 'win',
                  score: +100,
                });

                // 유저의 점수 증가 시키기
                const addUserTable = await db
                  .update(users)
                  .set({ score_num: sql`${users.score_num} + 100` })
                  .where(eq(users.userid_num, userid_num));

                // 챌린저 수 만큼 돈을 나눠서 입금
                // account 내역 추가
                divMoney = Math.round(leftMoney / findWinner.length);
                const money = await db.insert(account).values({
                  userid_num: userid_num,
                  transaction_description: 'challenge/success',
                  transaction_type: 'carrot/deposit',
                  transaction_amount: divMoney,
                  status: false,
                });

                // user 잔고에 돈 입금
                const newMoney = await db
                  .update(users)
                  .set({ carrot: sql`${users.carrot} + ${divMoney}` }) //sql`${users.money} + ${divMoney}`
                  .where(eq(users.userid_num, userid_num));
              } else {
                // case 3. 이긴 사람이 존재 한다. (but! 나는 짐)
                console.log('이긴 사람 존재 하지만 나는 짐');

                // 내 현재 점수
                const checkScore = await db
                  .select({ score_num: users.score_num })
                  .from(users)
                  .where(eq(users.userid_num, userid_num));

                const myScore = checkScore[0].score_num;
                console.log(myScore);

                // score 감소
                const loseScore = await db.insert(score).values({
                  userid_num: userid_num,
                  score_description: '챌린지 실패...',
                  score_type: 'lose',
                  score: -50,
                });

                // 유저의 점수 감소 시키기 ( 50 이하면 0점으로 )
                if (myScore > 50) {
                  const addUserTable = await db
                    .update(users)
                    .set({ score_num: sql`${users.score_num} - 50` })
                    .where(eq(users.userid_num, userid_num));
                } else {
                  const addUserTable = await db
                    .update(users)
                    .set({ score_num: 0 })
                    .where(eq(users.userid_num, userid_num));
                }
              }
              // challengerInfo 내역 업데이트(캐럿 추가)
              for (let i = 0; i < winners.length; i++) {
                for (let j = 0; j < challengerInfo.length; j++) {
                  if (winners[i] === challengerInfo[j].userid_num) {
                    challengerInfo[j] = {
                      ...challengerInfo[j],
                      carrot: divMoney,
                      score: 100,
                    };
                  } else {
                    challengerInfo[j] = {
                      ...challengerInfo[j],
                      carrot: -challengeInfo.goal_money,
                      score: -50,
                    };
                  }
                }
              }
            }
          }
        }
      }
    }

    challengeInfo = await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
    challengeInfo = challengeInfo[0];
    console.log('challengeInfo', challengeInfo);
    console.log('challengerInfo >>> ', challengerInfo);
    // 현재 점수
    const nowScore = await db
      .select({ score_num: users.score_num })
      .from(users)
      .where(eq(users.userid_num, userid_num));
    console.log('현재 점수 >> ', nowScore[0].score_num);
    return { challengeInfo, challengerInfo, nowScore };
  }

  // challenge 테이블에서 authentication_start_date로 부터 30일 지났으면 삭제
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const everyChallenge = await db.select().from(challenge);

    const dateNow = addHours(new Date(), 9);

    for (let i = 0; i < everyChallenge.length; i++) {
      const time = everyChallenge[i].authentication_start_date
        .toLocaleString('en-US', {
          timeZone: 'Asia/Seoul',
        })
        .split(',')[0];

      const month = Number(time.split('/')[0]);
      const day = Number(time.split('/')[1]);
      const year = Number(time.split('/')[2]);

      const timeNow = addMonths(new Date(year, month - 1, day), 1);

      if (dateNow === timeNow || dateNow > timeNow) {
        await db
          .delete(challenge)
          .where(eq(challenge.challenge_id, everyChallenge[i].challenge_id));
      }
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async hendleCron() {
    // 챌린지 시작 날짜 찾기
    const Challenges = await db.select().from(challenge);

    const dateNow = new Date()
      .toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
      })
      .split(',');

    for (let i = 0; i < Challenges.length; i++) {
      const challenge_time = Challenges[i].authentication_start_date
        .toLocaleString('en-US', {
          timeZone: 'Asia/Seoul',
        })
        .split(',');

      // 챌린지 생성자 아이디
      let myNumber: number = Challenges[i].userid_num;

      //현재 챌린지 Number
      let Challenge_num = Challenges[i].challenge_id;

      // 챌린지의 돈이 얼마인지 확인하기
      let Challenge_money = Challenges[i].goal_money;

      // let findMyChallengeNumber = await db.select({challenge_id: challenge.challenge_id}).from(challenge).where(eq(challenge.userid_num, myNumber))
      if (challenge_time === dateNow || challenge_time < dateNow) {
        for (let p = 0; p < Challenges[i].challenger_userid_num.length; p++) {
          let needDelete = true;

          // 생성자가 아닌 유저가 아닌 유저가 isAccept가 하나라도 true 이면
          if (
            Challenges[i].challenger_userid_num[p].isAccept === true &&
            Challenges[i].challenger_userid_num[p].userid_num !== myNumber
          ) {
            needDelete = false;
          }

          if (needDelete === true) {
            const sendNotification = await db.insert(notification).values({
              userid_num: myNumber,
              reference_id: Challenge_num,
              type: 'challenge/delete/noChallenger',
              message: { challengeName: Challenges[i].challenge_name },
              is_confirm: false,
            });

            // 돈 재입금
            const goBackMoney = await db
              .update(users)
              .set({ carrot: sql`${users.carrot} + ${Challenge_money}` })
              .where(eq(users.userid_num, myNumber));

            // account 계좌 전적 추가
            const intoAccount = await db.insert(account).values({
              transaction_description: 'challenge/deleted',
              transaction_type: 'carrot/deposit',
              transaction_amount: Challenge_money,
              status: false,
              userid_num: myNumber,
            });

            // challenge Delete
            const deleteColumn = await db
              .delete(challenge)
              .where(eq(challenge.challenge_id, Challenge_num));
          }
        }
      }
    }
  }
}
