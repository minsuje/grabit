import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ChallengeCreateDto } from './dto/challenge-create.dto';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.module';

@Controller('/')
export class ChallengeController {
  constructor(private ChallengeService: ChallengeService) {}
  // 챌린지 생성
  @Post('/challengeCreate')
  postChallengeCreate(@Body() body: ChallengeCreateDto): any {
    return this.ChallengeService.newChallenge(body);
  }

  // 챌린지 목록
  @Get('/challengeList')
  getChallengeList(): any {
    return this.ChallengeService.challengeList();
  }

  // 챌린지 상세 정보 보기
  @Get('/challengeDetail/:challenge_id')
  getChallengeDetail(@Param('challenge_id') challenge_id: any): any {
    console.log('controller', challenge_id);
    return this.ChallengeService.challengeDetail(challenge_id);
  }
}
