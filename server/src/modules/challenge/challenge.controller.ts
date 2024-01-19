import { Body, Controller, ImATeapotException, Post } from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';
import { ChallengeCreateService } from './challenge.service';
import { Challenge } from './challenge.module';

@Controller('/challengeCreate')
export class ChallengeCreateController {
  constructor(private ChallengeCreateService: ChallengeCreateService) {}
  @Post()
  postChallengeCreate(@Body() body: ChallengeCreateDto): any {
    // console.log('postChallengeCreate', body);
    return this.ChallengeCreateService.newChallenge(body);
  }
}
