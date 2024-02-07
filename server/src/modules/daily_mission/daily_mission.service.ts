import { Injectable } from '@nestjs/common';
import { db } from 'db/db';
import { dailyMission } from './schema';
import { Cron } from '@nestjs/schedule';
import { arrayOverlaps, eq } from 'drizzle-orm';
import { score, users } from '../user/schema';

type MyObjectType = {
  /* object structure */
  title: string;
  topic: string[];
};

@Injectable()
export class DailyMissionService {
  getDailyMission = async (userid_num: number) => {
    //미션 성공 여부
    let completed = 'none';
    let topic: string[];

    let mission_content = [
      { title: '물 한잔 마시기', topic: ['water', 'glass', 'cup'] },
      { title: '공부하기', topic: ['book', 'study', 'desk', 'table'] },
      { title: '책 읽기', topic: ['book', 'read', 'desk', 'table', 'word'] },
      {
        title: '스트레칭하기',
        topic: ['person', 'people', 'relax', 'rest', 'stretching'],
      },
      {
        title: '양치하기',
        topic: [
          'brush',
          'teeth',
          'teeth brush',
          'toothpaste',
          'bathroom',
          'mouse',
        ],
      },
      { title: '하늘 보기', topic: ['sky', 'cloud', 'blue'] },
      {
        title: '청소하기',
        topic: ['clean', 'blanket', 'bedding', 'covers', 'blankets'],
      },
      {
        title: '이불 정리하기',
        topic: ['clean', 'blanket', 'bedding', 'covers', 'blankets'],
      },
      {
        title: '텀블러 챙기기',
        topic: ['cup', 'tumbler', 'stainless', 'steel', 'bag'],
      },
      {
        title: '뉴스 보기',
        topic: [
          'news',
          'TV',
          'television',
          'smart phone',
          'cell phone',
          'phone',
          'blue screen',
          'people',
          'person',
        ],
      },
    ];
    let random_index = Math.floor(Math.random() * mission_content.length);
    let random_mission: any = mission_content[random_index];

    //DB있는지 확인하기
    const checkDB = await db.select().from(dailyMission);

    // DB 만들기 > 없다면
    if (checkDB.length == 0) {
      let createMission = await db
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

    let mission = mission_name[0].mission_content;
    return { completed, mission };
  };

  // @Cron을 사용하여 매일 23:59.59 에 초기화 실행
  @Cron('59 59 23 * * *') // 매일 23:59에 실행
  async handleCron() {
    try {
      // 여기에서 테이블 삭제 또는 필요한 작업을 수행합니다.
      const deleteDaily = await db.delete(dailyMission);
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

      // case1. 버그가 생겨서 또 인증 됐을 때 에러 처리
      if (
        successArray[0].success_userid_num !== null &&
        successArray[0].success_userid_num.includes(userid_num)
      ) {
        return {
          msg: '이미 인증 되었습니다.',
        };
      }

      // userState에 저장 하기
      let userState: number[] = [];
      if (successArray[0].success_userid_num !== null) {
        userState = successArray[0].success_userid_num;
      }

      // 성공한 유저를 배열에 추가
      userState.push(userid_num);

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
