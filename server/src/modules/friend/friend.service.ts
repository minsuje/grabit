import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { db } from '../../../db/db';
import { friend } from './schema';
import { eq, not, and, or } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';
import { users } from '../user/schema';

@Injectable()
export class FriendService {
  //# 유저 친구 목록 조회
  async findOne(userid: number, friends_info: any) {
    console.log(friends_info);
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
    // if (result.length < 1) {
    //   return { msg: '친구가 없습니다' };
    // }

    return { friends_info };
  }

  //# 유저 친구 추가
  async create(createFriendDto: CreateFriendDto, userid: number) {
    // console.log(createFriendDto, userid);
    const { other_userid_num, is_friend } = createFriendDto;

    if (other_userid_num == userid)
      return { msg: '본인과 친구를 맺을 수 없습니다' };

    // 교차 검색
    const result = await db
      .select()
      .from(friend)
      .where(
        and(
          or(
            eq(friend.userid_num, userid),
            eq(friend.other_userid_num, userid),
          ),
          or(
            eq(friend.other_userid_num, other_userid_num),
            eq(friend.userid_num, other_userid_num),
          ),
        ),
      );

    console.log('result', result);

    if (result.length < 1) {
      return await db.insert(friend).values({
        userid_num: userid,
        other_userid_num: other_userid_num,
        is_friend,
      });
    } else {
      if (result[0].is_friend === true) return { msg: '이미 친구입니다' };
      else return { msg: '이미 전송된 친구 요청입니다' };
    }
  }

  findAll() {
    return `This action returns all friend`;
  }

  //# 친구 상태 업데이트
  async update(id: number, updateFriendDto: UpdateFriendDto) {
    console.log(id, updateFriendDto);

    const { is_friend, other_userid_num } = updateFriendDto;

    // 교차 검색
    const findFriend = await db
      .select()
      .from(friend)
      .where(
        and(
          or(eq(friend.userid_num, id), eq(friend.other_userid_num, id)),
          or(
            eq(friend.other_userid_num, other_userid_num),
            eq(friend.userid_num, other_userid_num),
          ),
        ),
      );

    if (findFriend.length > 0) {
      console.log('findFriend', findFriend[0].is_friend);

      if (findFriend[0].is_friend === false) {
        console.log('친구 상태 업데이트');
        const result = await db
          .update(friend)
          .set({ is_friend: true })
          .where(
            and(
              or(eq(friend.userid_num, id), eq(friend.other_userid_num, id)),
              or(
                eq(friend.other_userid_num, other_userid_num),
                eq(friend.userid_num, other_userid_num),
              ),
            ),
          );

        if (result) {
          return { msg: `${id}님과 ${other_userid_num}님이 친구가 되었습니다` };
        }
      } else {
        return { msg: '이미 친구입니다' }; // 친구 상태가 아닌 경우 예외처리 필요함. 친구 상태는 업데이트 되지 않음.
      }
    } else {
      return { msg: '해당하는 친구 요청이 없습니다' };
    }
  }

  //# 친구 삭제
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
