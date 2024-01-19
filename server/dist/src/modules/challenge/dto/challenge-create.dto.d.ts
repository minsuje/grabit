export declare class ChallengeCreateDto {
    challenge_id?: number;
    userid_num?: number;
    challenge_name: string;
    topic: string;
    challenger_userid_num: number[];
    goal_money: number;
    deadline: string;
    winner_userid_num?: number[];
    authentication_term: number;
    authentication_time: string;
}
