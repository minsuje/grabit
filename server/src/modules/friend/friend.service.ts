import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { db } from '../../../db/db';
import { friend } from './schema';
import { eq, not, and } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';
import { users } from '../user/schema';

@Injectable()
export class FriendService {
  async findOne(userid: number, friends_info: any) {
    // const userid_num = userid;
    // const result = await db
    //   .select({ friends: friend.other_userid_num })
    //   .from(friend)
    //   .where(eq(friend.userid_num, userid_num));

    // let friends = [];

    // for (let i = 0; i < result.length; i++) {
    //   const res = await db
    //     .select({ user: users.userid })
    //     .from(users)
    //     .where(eq(users.userid_num, result[i].friends));
    //   friends.push(res[0].user);
    // }

    return { friends_info };
  }

  async create(createFriendDto: CreateFriendDto, userid: number) {
    console.log(createFriendDto, userid);
    const { other_userid_num, is_friend } = createFriendDto;

    const userid_num = userid;
    const result = await db
      .select()
      .from(friend)
      .where(
        and(
          eq(friend.userid_num, userid_num),
          eq(friend.other_userid_num, other_userid_num),
        ),
      );

    console.log(result.length);

    if (result.length < 1) {
      return await db.insert(friend).values({
        userid_num: userid,
        other_userid_num: other_userid_num,
        is_friend,
      });
    } else {
      return { msg: '이미 친구입니다' };
    }
  }

  findAll() {
    return `This action returns all friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return;
  }

  async remove(createFriendDto: CreateFriendDto, userid: number) {
    console.log(createFriendDto, userid);
    const { other_userid_num } = createFriendDto;
    return await db
      .delete(friend)
      .where(
        and(
          eq(friend.userid_num, userid),
          eq(friend.other_userid_num, other_userid_num),
        ),
      );
  }
}
