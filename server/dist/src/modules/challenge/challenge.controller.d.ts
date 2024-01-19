import { ChallengeCreateDto } from './dto/challenge-create.dto';
import { ChallengeCreateService } from './challenge.service';
export declare class ChallengeCreateController {
    private ChallengeCreateService;
    constructor(ChallengeCreateService: ChallengeCreateService);
    postChallengeCreate(body: ChallengeCreateDto): any;
}
