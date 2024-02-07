import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { db } from 'db/db';
import { eq, gt, desc } from 'drizzle-orm';
import { notification } from './schema';
import { friend } from '../friend/schema';
import { challenge } from '../challenge/schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addHours, addMonths } from 'date-fns';
@Injectable()
export class NotificationService {
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findOne = async (userid_num: number) => {
    const result = await db
      .select()
      .from(notification)
      .where(eq(notification.userid_num, userid_num))
      .orderBy(desc(notification.created_at));

    if (result.length > 0) {
      return result;
    } else {
      return { msg: '알림 없음' };
    }
  };

  patchNoti = async (notification_id: number) => {
    return await db
      .update(notification)
      .set({
        is_confirm: true,
      })
      .where(eq(notification.notification_id, notification_id));
  };

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      const dateNow = addHours(new Date(), 9);

      const currentTime = await db.select().from(notification);

      for (let i = 0; i < currentTime.length; i++) {
        const time = currentTime[i].created_at
          .toLocaleString('en-US', {
            timeZone: 'Asia/Seoul',
          })
          .split(',')[0];

        const month = Number(time.split('/')[0]);
        const day = Number(time.split('/')[1]);
        const year = Number(time.split('/')[2]);

        const timenow = addMonths(new Date(year, month, day), 1);

        if (dateNow === timenow || dateNow > timenow) {
          await db
            .delete(notification)
            .where(
              eq(notification.notification_id, currentTime[i].notification_id),
            );
        }
      }
    } catch (error) {
      console.error('에러 발생', error.message);
    }
  }
}
