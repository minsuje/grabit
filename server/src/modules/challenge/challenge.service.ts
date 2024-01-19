import { Injectable } from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';
import { challenge } from './schema';
import { db } from '../../../db/db';

@Injectable()
export class ChallengeCreateService {
    newChallenge = async (body: ChallengeCreateDto) => {
        const {
            challenge_name,
            topic,
            challenger_userid_num,
            goal_money,
            deadline,
            authentication_term,
            authentication_time,
        } = body;

        console.log(goal_money);
        return await db.insert(challenge).values({
            challenge_name: challenge_name,
            topic: topic,
            challenger_userid_num: challenger_userid_num,
            goal_money: goal_money,
            deadline: deadline,
            authentication_term: authentication_term,
            authentication_time: authentication_time,
        });
    };
}
