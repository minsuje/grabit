export class ChallengeDto {
  challenge_id?: number;
  userid_num?: number;
  challenge_name: string;
  is_public: boolean;
  topic: string;
  auth_keyword: string;
  challenger_userid_num?: object[];
  goal_money: number;
  term: number;
  winner_userid_num?: number[];
  authentication_start_date: Date;
  authentication_end_date: Date;
  authentication_start_time: number;
  authentication_end_time: number;
}
