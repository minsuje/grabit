import { ChallengeCreateDto } from './dto/challenge-create.dto';
export declare class ChallengeCreateService {
    newChallenge: (body: ChallengeCreateDto) => Promise<import("pg").QueryResult<never>>;
}
