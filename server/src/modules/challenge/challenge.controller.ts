import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.module';

@Controller('/')
export class ChallengeController {
  constructor(private ChallengeService: ChallengeService) {}
  // 챌린지 생성
  @Post('/challengeCreate')
  postChallengeCreate(@Body() body: ChallengeDto): any {
    return this.ChallengeService.newChallenge(body);
  }

  // 챌린지 목록
  @Get('/challengeList')
  getChallengeList(): any {
    return this.ChallengeService.challengeList();
  }

  // 챌린지 상세 정보 보기
  @Get('/challengeDetail/:challenge_id')
  getChallengeDetail(@Param('challenge_id') challenge_id: number): any {
    console.log('controller', challenge_id);
    return this.ChallengeService.challengeDetail(challenge_id);
  }

  // 챌린지 수정 페이지 보기
  // @Get('/challengeEdit/:challenge_id')
  // getChallengeEdit(@Param('challenge_id') challenge_id: number): any {
  //   return this.ChallengeService.getChallengeEdit(challenge_id);
  // }

  // 챌린지 수정하기
  @Patch('/challengeEdit/:challenge_id')
  patchChallengeEdit(
    @Param('challenge_id') challenge_id: number,
    @Body() body: ChallengeDto,
  ): any {
    return this.ChallengeService.patchChallengeEdit(body, challenge_id);
  }

  // 챌린지 삭제하기
  @Delete('/challengeEdit/:challenge_id')
  deleteChallengeEdit(@Param('challenge_id') challenge_id: number): any {
    return this.ChallengeService.deleteChallengeEdit(challenge_id);
  }
}
