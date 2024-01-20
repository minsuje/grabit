import { ChallengeCreateDto } from './dto/challenge-create.dto';
export declare class ChallengeCreateService {
    newChallenge: (body: ChallengeCreateDto) => Promise<import("pg").QueryResult<never>>;
}
export declare class ChallengeListService {
    challengeList: () => Promise<{
        userid_num: number;
        challenge_id: number;
        challenge_name: string;
        topic: string;
        challenger_userid_num: number[];
        goal_money: number;
        deadline: string;
        winner_userid_num: number[];
        authentication_term: number;
        authentication_time: string;
    }[]>;
}
