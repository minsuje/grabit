import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { db } from 'db/db';
import { eq } from 'drizzle-orm';
import { notification } from './schema';
import { friend } from '../friend/schema';
import { challenge } from '../challenge/schema';
@Injectable()
export class NotificationService {
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {}

  findOne = async (userid_num: number) => {
    console.log('userid_num >>>>>', userid_num);
    const result = await db
      .select()
      .from(notification)
      .where(eq(notification.userid_num, userid_num));

    console.log('result >>>>>', result);

    const friendJoin = await db
      .select()
      .from(notification)
      .leftJoin(friend, eq(notification.reference_id, friend.friend_id))
      .leftJoin(
        challenge,
        eq(notification.reference_id, challenge.challenge_id),
      );

    console.log('friendJoin >>>>>', friendJoin);

    if (result.length > 0) {
      const findFriend = await db
        .select({})
        .from(friend)
        .where(eq(friend.userid_num, userid_num));
      return result;
    } else {
      return { msg: '알림 없음' };
    }
  };

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
