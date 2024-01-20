export class ChallengeDto {
  challenge_id?: number;
  userid_num?: number;
  challenge_name: string;
  is_public: string;
  topic: string;
  challenger_userid_num: number[];
  goal_money: number;
  deadline: string;
  winner_userid_num?: number[];
  authentication_start_date: string;
  authentication_end_date: string;
  authentication_start_time: number;
  authentication_end_time: number;
}
