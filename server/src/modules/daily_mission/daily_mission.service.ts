import { Injectable } from '@nestjs/common';
import { db } from 'db/db';
import { dailyMission } from './schema';
import { Cron } from '@nestjs/schedule';
import { arrayOverlaps, eq } from 'drizzle-orm';
import { score, users } from '../user/schema';

@Injectable()
export class DailyMissionService {
  getDailyMission = async (userid_num: number) => {
    //미션 성공 여부
    let completed = 'none';
    let topic: string[];

    let mission_content = [
      '물 한잔 마시기',
      '공부하기',
      '책 읽기',
      '스트레칭하기',
      '양치하기',
      '하늘 보기',
      '청소하기',
      '이불 정리하기',
      '텀블러 챙기기',
      '뉴스 보기',
    ];
    let random_index = Math.floor(Math.random() * mission_content.length);
    let random_mission = mission_content[random_index];

    switch (random_index) {
      case random_index:
        0;
        topic = ['water', 'glass', 'cup'];
        break;
      case random_index:
        1;
        topic = ['book', 'study', 'desk', 'table'];
        break;
      case random_index:
        2;
        topic = ['book', 'read', 'desk', 'table', 'word'];
        break;
      case random_index:
        3;
        topic = ['person', 'people', 'relax', 'rest', 'stretching'];
        break;
      case random_index:
        4;
        topic = [
          'brush',
          'teeth',
          'teeth brush',
          'toothpaste',
          'bathroom',
          'mouse',
        ];
        break;
      case random_index:
        5;
        topic = ['sky', 'cloud', 'blue'];
        break;
      case random_index:
        6;
        topic = ['brush', 'clean', 'cleaning', 'vacuum cleaner', 'cleaner'];
        break;
      case random_index:
        7;
        topic = ['clean', 'blanket', 'bedding', 'covers', 'blankets'];
        break;
      case random_index:
        8;
        topic = ['cup', 'tumbler', 'stainless', 'steel', 'bag'];
        break;
      case random_index:
        9;
        topic = [
          'news',
          'TV',
          'television',
          'smart phone',
          'cell phone',
          'phone',
          'blue screen',
          'people',
          'person',
        ];
        break;
    }

    // if ((random_index = 0)) {
    //   topic = ['water', 'glass', 'cup'];
    // } else if ((random_index = 1)) {
    //   topic = ['book', 'study', 'desk', 'table'];
    // } else if ((random_index = 2)) {
    // }

    //DB있는지 확인하기
    const checkDB = await db.select().from(dailyMission);

    // DB 만들기 > 없다면
    if (checkDB.length == 0) {
      const createMission = await db
        .insert(dailyMission)
        .values({ mission_content: random_mission });
    }

    // 미션 이름 DB에서 찾기
    const mission_name = await db
      .select({ mission_content: dailyMission.mission_content })
      .from(dailyMission);

    // 성공한 유저 확인
    const checkUser = await db
      .select({ success_userid_num: dailyMission.success_userid_num })
      .from(dailyMission);

    if (checkUser[0].success_userid_num !== null) {
      if (checkUser[0].success_userid_num.includes(userid_num)) {
        completed = 'success';
      }
    }
    return { completed, mission_name, topic };
  };

  // @Cron을 사용하여 매일 23:59.59 에 초기화 실행
  @Cron('59 59 23 * * *') // 매일 23:59에 실행
  async handleCron() {
    try {
      // 여기에서 테이블 삭제 또는 필요한 작업을 수행합니다.
      const deleteDaily = await db.delete(dailyMission);
      console.log('매일 23:59에 실행됨');
    } catch (error) {
      console.error('에러 발생:', error.message);
    }
  }

  async success(isSuccess: Boolean, userid_num: number) {
    isSuccess = true;
    if (isSuccess == true) {
      // DB에 저장되어 있는 유저 정보 꺼내오기
      const successArray = await db
        .select({ success_userid_num: dailyMission.success_userid_num })
        .from(dailyMission);

      console.log('success Array > ', successArray[0].success_userid_num);

      // case1. 버그가 생겨서 또 인증 됐을 때 에러 처리
      if (
        successArray[0].success_userid_num !== null &&
        successArray[0].success_userid_num.includes(userid_num)
      ) {
        console.log('이미 인증 되었습니다.');
        return {
          msg: '이미 인증 되었습니다.',
        };
      }

      // userState에 저장 하기
      let userState: number[] = [];
      if (successArray[0].success_userid_num !== null) {
        userState = successArray[0].success_userid_num;
      }

      console.log('userState > ', userState);

      // 성공한 유저를 배열에 추가
      userState.push(userid_num);
      console.log('push userState >> ', userState);

      // 추가한 배열을 DB에 저장
      const getSuccess = await db
        .update(dailyMission)
        .set({ success_userid_num: userState });

      // db에서 해당 유저의 점수를 가져옴
      const getMyScore = await db
        .select({ score_num: users.score_num })
        .from(users)
        .where(eq(users.userid_num, userid_num));

      // 10점 추가
      const myScore = getMyScore[0].score_num + 10;

      // 점수 추가
      const addScore = await db
        .update(users)
        .set({ score_num: myScore })
        .where(eq(users.userid_num, userid_num));

      // 점수가 추가될 때 score테이블에 설명 추가
      if (addScore) {
        const addScoreTable = await db.insert(score).values({
          userid_num: userid_num,
          score_description: '데일리 미션 성공',
          score_type: 'win',
          score: 10,
        });
      }

      return {
        msg: '인증 성공',
        score: '10 XP',
      };
    } else {
      return {
        msg: '오류 발생',
      };
    }
  }
}
