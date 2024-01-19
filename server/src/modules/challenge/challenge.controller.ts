import {
  Body,
  Controller,
  Get,
  ImATeapotException,
  Patch,
  Post,
} from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';
import {
  ChallengeCreateService,
  ChallengeListService,
} from './challenge.service';
import { Challenge } from './challenge.module';

@Controller('/challengeCreate')
export class ChallengeCreateController {
  constructor(private ChallengeCreateService: ChallengeCreateService) {}
  @Post()
  postChallengeCreate(@Body() body: ChallengeCreateDto): any {
    return this.ChallengeCreateService.newChallenge(body);
  }
}

@Controller('/challengeList')
export class ChallengeListController {
  constructor(private ChallengeListService: ChallengeListService) {}
  @Get()
  getChallengeList(): any {
    return this.ChallengeListService.challengeList();
  }
}
