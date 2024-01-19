import { Body, Controller, Post } from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';

@Controller('/challengeCreate')
export class ChallengeCreateController {
  @Post()
  postChallengeCreate(@Body() ChallengeCreateDto: ChallengeCreateDto) {
    console.log('postChallengeCreate', ChallengeCreateDto);
  }
}
