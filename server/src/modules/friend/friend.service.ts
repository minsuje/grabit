import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { db } from '../../../db/db';
import { friend } from './schema';
import { eq, not, and, or } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';
import { users } from '../user/schema';
import { notification } from '../notification/schema';
import { compareSync } from 'bcrypt';

@Injectable()
export class FriendService {
  //# 유저 친구 목록 조회
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
    // if (result.length < 1) {
    //   return { msg: '친구가 없습니다' };
    // }

    return { friends_info };
  }

  //# 유저 친구 추가
  async create(
    createFriendDto: CreateFriendDto,
    userid: number,
    login_userid_num: number,
  ) {
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
            eq(friend.userid_num, login_userid_num),
            eq(friend.other_userid_num, login_userid_num),
          ),
          or(
            eq(friend.other_userid_num, other_userid_num),
            eq(friend.userid_num, other_userid_num),
          ),
        ),
      );
    console.log('result >  ', result);

    if (result.length < 1) {
      const newFriendRequest = await db
        .insert(friend)
        .values({
          userid_num: userid,
          other_userid_num: other_userid_num,
          is_friend,
        })
        .returning();

      const friendInfo = await db
        .select({ nickname: users.nickname, userid: users.userid })
        .from(users)
        .where(eq(users.userid_num, login_userid_num));

      await db.insert(notification).values({
        userid_num: other_userid_num,
        reference_id: newFriendRequest[0].friend_id,
        type: 'friend',
        message: {
          friendName: friendInfo[0].userid,
          requestorName: friendInfo[0].nickname,
        },
        is_confirm: false,
      });
      return { msg: '친구 신청이 완료되었습니다' };
    } else {
      if (result[0].is_friend === true) return { msg: '이미 친구입니다' };
      else return { msg: '이미 전송된 친구 요청입니다' };
    }
  }

  findAll() {
    return `This action returns all friend`;
  }

  //# 친구 상태 업데이트
  async update(
    id: number,
    updateFriendDto: UpdateFriendDto,
    login_userid_num: number,
  ) {
    const { is_friend, other_userid_num, type } = updateFriendDto;

    // 교차 검색
    const findFriend: any = await db
      .select()
      .from(friend)
      .where(
        and(
          or(
            eq(friend.userid_num, login_userid_num),
            eq(friend.other_userid_num, login_userid_num),
          ),
          or(
            eq(friend.other_userid_num, other_userid_num),
            eq(friend.userid_num, other_userid_num),
          ),
        ),
      );

    if (findFriend.length > 0) {
      if (findFriend[0].is_friend === false) {
        if (type === 'accept') {
          const result = await db
            .update(friend)
            .set({ is_friend: true })
            .where(
              and(
                or(
                  eq(friend.userid_num, login_userid_num),
                  eq(friend.other_userid_num, login_userid_num),
                ),
                or(
                  eq(friend.other_userid_num, other_userid_num),
                  eq(friend.userid_num, other_userid_num),
                ),
              ),
            )
            .returning();

          if (result) {
            let name1: any = await db
              .select({ name: users.name })
              .from(users)
              .where(eq(users.userid_num, login_userid_num));
            let name2: any = await db
              .select({ name: users.name })
              .from(users)
              .where(eq(users.userid_num, other_userid_num));
            name1 = name1[0].name;
            name2 = name2[0].name;
            return { msg: `${name1}님과 ${name2}님이 친구가 되었습니다` };
          }
        } else if (type === 'reject') {
          const reject = await db
            .delete(friend)
            .where(eq(friend.friend_id, findFriend[0].friend_id));
          return { msg: '친구 요청을 거절하였습니다' };
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
    const { other_userid } = createFriendDto;

    const friend_id_num = await db
      .select()
      .from(users)
      .where(eq(users.userid, other_userid));

    return await db
      .delete(friend)
      .where(
        and(
          or(
            eq(friend.userid_num, userid),
            eq(friend.other_userid_num, userid),
          ),
          or(
            eq(friend.other_userid_num, friend_id_num[0].userid_num),
            eq(friend.userid_num, friend_id_num[0].userid_num),
          ),
        ),
      );
  }
}
