import { ChallengeCreateDto } from './dto/challenge-create.dto';
export declare class ChallengeCreateService {
    newChallenge: (body: ChallengeCreateDto) => Promise<QueryResult<import("drizzle-orm").Assume<this["row"], QueryResultRow>>>;
}
