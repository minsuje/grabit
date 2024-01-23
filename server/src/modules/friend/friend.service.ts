import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { db } from '../../../db/db';
import { friend } from './schema';
import { eq, not } from 'drizzle-orm';
import { isBefore, isAfter } from 'date-fns';

@Injectable()
export class FriendService {
  async findUserFriends(body: CreateFriendDto) {
    const { userid_num } = body;
    return db.select().from(friend).where(eq(friend.userid_num, userid_num));
  }

  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend';
  }

  findAll() {
    return `This action returns all friend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
