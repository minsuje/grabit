import { Injectable } from '@nestjs/common';
import { db } from 'db/db';
import { dailyMission } from './schema';
import { Cron } from '@nestjs/schedule';
import { arrayOverlaps } from 'drizzle-orm';

@Injectable()
export class DailyMissionService {
  getDailyMission = async (userid_num: number) => {
    //미션 성공 여부
    let completed = 'none';

    let mission_content = [
      '물 한잔 마시기',
      '공부하기',
      '책 읽기',
      '스트레칭하기',
      '친구/가족에게 문자 보내기',
      '하늘 보기',
      '산책하기',
      '감사한 일 3가지 적기',
      '외출하기',
      '뉴스 보기',
    ];
    let random_index = Math.floor(Math.random() * mission_content.length);
    let random_mission = mission_content[random_index];

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
    return { completed, mission_name };
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

  async success(isSuccess: Boolean, userid: number) {
    if (isSuccess == true) {
      const getSuccess = await db
        .update(dailyMission)
        .set({ success_userid_num: [userid] });

      return {
        msg: '인증 성공',
      };
    }
  }
}
