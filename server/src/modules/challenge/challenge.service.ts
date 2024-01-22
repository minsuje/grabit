import { Injectable } from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import { challenge } from './schema';
import { db } from '../../../db/db';
import { eq, not } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';

@Injectable()
export class ChallengeService {
  // 챌린지 생성
  newChallenge = async (body: ChallengeDto) => {
    const {
      challenge_name,
      is_public,
      topic,
      challenger_userid_num,
      goal_money,
      term,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    } = body;

    return await db.insert(challenge).values({
      challenge_name,
      is_public,
      topic,
      challenger_userid_num,
      goal_money,
      term,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    });
  };

  // 챌린지 목록
  challengeList = async () => {
    const today = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const challengeAll = await db.select().from(challenge);
    let myChallenge = [];
    for (let i = 0; i < challengeAll.length; i++) {
      if (challengeAll[i].challenger_userid_num.includes(3))
        // 3 대신 JWT에서 찾아온 userid_num 값 넣어줘야 함
        myChallenge.push(challengeAll[i]);
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

    // 열려있는 챌린지
    const publicChallengeAll = await db
      .select()
      .from(challenge)
      .where(eq(challenge.is_public, 'true'));
    let publicChallenge = [];
    for (let i = 0; i < publicChallengeAll.length; i++) {
      if (!publicChallengeAll[i].challenger_userid_num.includes(3))
        // 3 대신 JWT에서 찾아온 userid_num 값 넣어줘야 함
        publicChallenge.push(publicChallengeAll[i]);
    }
    let prePublicChallenge = [];
    for (let i = 0; i < publicChallenge.length; i++) {
      if (isAfter(publicChallenge[i].authentication_start_date, new Date())) {
        prePublicChallenge.push(publicChallenge[i]);
      }
    }
    return { ingMyChallenge, preMyChallenge, prePublicChallenge };
  };

  // 챌린지 상세 정보 보기
  challengeDetail = async (challenge_id: number) => {
    // console.log('service', challenge_id);
    return await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
  };

  // 챌린지 수정 페이지 보기
  getChallengeEdit = async (challenge_id: number) => {
    return await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
  };

  // 챌린지 수정하기
  patchChallengeEdit = async (body: ChallengeDto, challenge_id: number) => {
    const {
      challenge_name,
      topic,
      goal_money,
      term,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    } = body;
    return await db
      .update(challenge)
      .set({
        challenge_name: challenge_name,
        topic: topic,
        goal_money: goal_money,
        term: term,
        authentication_start_date: authentication_start_date,
        authentication_end_date: authentication_end_date,
        authentication_start_time: authentication_start_time,
        authentication_end_time: authentication_end_time,
      })
      .where(eq(challenge.challenge_id, challenge_id));
  };
}
