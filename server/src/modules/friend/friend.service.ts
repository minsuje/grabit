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
  async findOne(userid: number) {
    const userid_num = userid;
    const result = await db
      .select({ friends: friend.other_userid_num })
      .from(friend)
      .where(eq(friend.userid_num, userid_num));

    let friends = [];

    // async function handleFriend() {
    //   result.map(async (friend) => {
    //     const result = await db.select({ user: users.userid }).from(users).where(eq(users.userid_num, friend.friends));
    //     console.log(result[0].user);
    //     console.log(friends);
    //     friends.push(result[0].user);
    //   });
    // }

    console.log(result);
    for (let i = 0; i < result.length; i++) {
      const res = await db.select({ user: users.userid }).from(users).where(eq(users.userid_num, result[i].friends));
      console.log(res[0].user);
      friends.push(res[0].user);
    }
    // handleFriend();

    console.log('return 바로전', friends);
    return friends;
  }

  async create(createFriendDto: CreateFriendDto, userid: number) {
    console.log(createFriendDto, userid);
    const { other_userid_num, is_friend } = createFriendDto;
    return await db.insert(friend).values({
      userid_num: userid,
      other_userid_num: other_userid_num,
      is_friend,
    });
  }

  findAll() {
    return `This action returns all friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  async remove(createFriendDto: CreateFriendDto, userid: number) {
    console.log(createFriendDto, userid);
    const { other_userid_num } = createFriendDto;
    return await db
      .delete(friend)
      .where(and(eq(friend.userid_num, userid), eq(friend.other_userid_num, other_userid_num)));
  }
}
