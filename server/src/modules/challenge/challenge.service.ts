import { Injectable } from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';

@Injectable()
export class ChallengeCreateService {
  // createNewChallenge(challengeCreateDto: ChallengeCreateDto) {
  //   const {
  //     userid_num,
  //     challenge_name,
  //     topic,
  //     challenger_userid_num,
  //     goal_money,
  //     deadline,
  //     authentication_term,
  //     authentication_time,
  //   } = challengeCreateDto;
  //   const challenge = {
  //     userid_num,
  //     challenge_name,
  //     topic,
  //     challenger_userid_num,
  //     goal_money,
  //     deadline,
  //     authentication_term,
  //     authentication_time,
  //   };
  // }
}
