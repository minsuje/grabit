import { Injectable } from '@nestjs/common';
import { db } from 'db/db';
import { dailyMission } from './schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DailyMissionService {
  getDailyMission = async () => {
    const checkDB = await db.select().from(dailyMission);
    console.log('checkDB >>>>>>>>>');

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
    console.log('readom_mission >>>', random_mission);

    // DB 만들기
    if (checkDB.length == 0) {
      const createMission = await db
        .insert(dailyMission)
        .values({ mission_content: random_mission });
      console.log('DB 만들기 성공');
    }

    const mission_name = await db
      .select({ mission_content: dailyMission.mission_content })
      .from(dailyMission);

    console.log(
      '🚀 ~ DailyMissionService ~ getDailyMission= ~ mission_name:',
      mission_name[0],
    );

    const checkDate = await db
      .select({ created_at: dailyMission.created_at })
      .from(dailyMission);

    console.log('daily_mission service CheckDate >>> ', checkDate);
    const createTime = checkDate[0].created_at;
    console.log(
      '🚀 ~ DailyMissionService ~ getDailyMission= ~ createTime:',
      createTime,
    );

    const time = createTime
      .toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
      })
      .split(',')[1];

    console.log('Time >>>>> ', time);

    const nowTime = new Date()
      .toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
      })
      .split(',')[1];

    console.log(
      '🚀 ~ DailyMissionService ~ getDailyMission= ~ nowTime:',
      nowTime,
    );
  };
}
