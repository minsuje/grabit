import { Injectable } from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import { challenge } from './schema';
import { db } from '../../../db/db';
import { eq, not } from 'drizzle-orm';

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
      deadline,
      authentication_start_date,
      authentication_end_date,
      authentication_start_time,
      authentication_end_time,
    } = body;

    console.log(goal_money);
    return await db.insert(challenge).values({
      challenge_name,
      is_public,
      topic,
      challenger_userid_num,
      goal_money,
      deadline,
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
    console.log(new Date().getFullYear());
    // 참가 예정 챌린지

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
    return publicChallenge;
  };

  // 챌린지 상세 정보 보기
  challengeDetail = async (challenge_id: any) => {
    console.log('service', challenge_id);
    return await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
  };
}
