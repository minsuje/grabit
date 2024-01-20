import { ChallengeCreateDto } from './dto/challenge-create.dto';
import { ChallengeCreateService, ChallengeListService } from './challenge.service';
export declare class ChallengeCreateController {
    private ChallengeCreateService;
    constructor(ChallengeCreateService: ChallengeCreateService);
    postChallengeCreate(body: ChallengeCreateDto): any;
}
export declare class ChallengeListController {
    private ChallengeListService;
    constructor(ChallengeListService: ChallengeListService);
    getChallengeList(): any;
}
