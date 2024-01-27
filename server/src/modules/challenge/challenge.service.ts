import { Injectable } from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import {
  challenge,
  authentication,
  authentication_img_emoticon,
} from './schema';
import { users } from '../user/schema';
import { db } from '../../../db/db';
import { eq, not, and, desc } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';
import { s3Middleware } from 'src/middleware/s3.middleware';
import { read } from 'fs';

@Injectable()
export class ChallengeService {
  // 챌린지 생성
  newChallenge = async (body: ChallengeDto) => {
    let {
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
      authentication_start_date: new Date(authentication_start_date),
      authentication_end_date: new Date(authentication_end_date),
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
      .where(eq(challenge.is_public, true));
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
    console.log('s3middleware service popularTopics', popularTopics);

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
  challengeDetail = async (challenge_id: number, urls: any) => {
    const challengeDetail = await db
      .select()
      .from(challenge)
      .where(eq(challenge.challenge_id, challenge_id));

    if (challengeDetail.length !== 0) {
      let challengers = [];
      for (
        let i = 0;
        i < challengeDetail[0].challenger_userid_num.length;
        i++
      ) {
        let challenger = await db
          .select()
          .from(users)
          .where(
            eq(users.userid_num, challengeDetail[0].challenger_userid_num[i]),
          );

        await challengers.push(challenger[0]);
      }

      return { challengeDetail, challengers, urls };
    } else return { msg: '존재하지 않는 챌린지입니다.' };
  };

  // 챌린지 수정 페이지 보기
  // getChallengeEdit = async (challenge_id: number) => {
  //   return await db
  //     .select()
  //     .from(challenge)
  //     .where(eq(challenge.challenge_id, challenge_id));
  // };

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
        authentication_start_date: new Date(authentication_start_date),
        authentication_end_date: new Date(authentication_end_date),
        authentication_start_time: authentication_start_time,
        authentication_end_time: authentication_end_time,
        updated_at: new Date(),
      })
      .where(eq(challenge.challenge_id, challenge_id));
  };

  // 챌린지 삭제하기
  deleteChallengeEdit = async (challenge_id: number) => {
    return await db
      .delete(challenge)
      .where(eq(challenge.challenge_id, challenge_id));
  };

  // 챌린지 인증하기
  newChallengeAuth = async (challenge_id: number, file: string) => {
    if (file) {
      let fileName: any = file.split('?')[0].split('.com/')[1];

      await db.insert(authentication).values({
        challenge_id: challenge_id,
        userid_num: 3, // JWT 토큰에서 찾아야 하는 값
        authentication_img: fileName,
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
          eq(
            authentication_img_emoticon.authentication_img_comment_userid_num,
            3, // JWT 토큰에서 찾아올 유저 정보
          ),
        ),
      );
    return { fileUrl, emoticon };
  };

  // 챌린지 인증사진에 대한 이모티콘 취소 요청

  deleteChallengeAuthEmoticon = async (
    challenge_id,
    authentication_id,
    authentication_img_emoticon_id,
  ) => {
    return await db
      .delete(authentication_img_emoticon)
      .where(
        eq(
          authentication_img_emoticon.authentication_img_emoticon_id,
          authentication_img_emoticon_id,
        ),
      );
  };

  // 챌린지 인증사진에 대한 이모티콘 요청
  newChallengeAuthEmoticon = async (body, challenge_id, authentication_id) => {
    const { authentication_img_comment_emoticon } = body;
    return await db.insert(authentication_img_emoticon).values({
      authentication_id,
      authentication_img_comment_userid_num: 3, // JWT 토큰에서 찾아야 하는 값
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
}
