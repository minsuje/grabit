import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import { ChallengeService } from './challenge.service';
import { Challenge } from './challenge.module';
import { s3Middleware } from 'src/middleware/s3.middleware';

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
  getChallengeDetail(
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ): any {
    // console.log('controller', challenge_id);
    console.log('controller challengeDetail req > ', req.file);
    return this.ChallengeService.challengeDetail(challenge_id, req.file);
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

  // 테스트 (s3 이미지 get 요청)
  // 챌린지 인증사진 상세 보기
  @Get('/challengeAuth/:challenge_id/:authentication_id')
  getChallengeAuth(
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
    @Req() req,
  ): any {
    const file = req.file;
    return this.ChallengeService.getChallengeAuth(
      challenge_id,
      authentication_id,
      file,
    );
  }

  // 테스트 (s3 이미지 post 요청)
  // 챌린지 인증사진 올리기
  @Post('/challengeAuth/:challenge_id')
  newChallengeAuth(
    @Body() body: any,
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ): any {
    const file = req.file;
    return this.ChallengeService.newChallengeAuth(challenge_id, file);
  }

  // 챌린지 인증사진에 대한 이모티콘 요청
  @Post('/challengeAuth/:challenge_id/:authentication_id')
  newChallengeAuthEmoticon(
    @Body() body: any,
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
  ): any {
    return this.ChallengeService.newChallengeAuthEmoticon(
      body,
      challenge_id,
      authentication_id,
    );
  }

  // 챌린지 인증사진에 대한 이모티콘 취소 요청
  @Delete(
    '/challengeAuth/:challenge_id/:authentication_id/:authentication_img_emoticon_id',
  )
  deleteChallengeAuthEmoticon(
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
    @Param('authentication_img_emoticon_id')
    authentication_img_emoticon_id: number,
  ): any {
    return this.ChallengeService.deleteChallengeAuthEmoticon(
      challenge_id,
      authentication_id,
      authentication_img_emoticon_id,
    );
  }

  // 테스트 (s3 이미지 patch 요청)
  @Patch('/challengeAuth/:challenge_id/:authentication_id')
  patchChallengeAuth(
    @Body() body: any,
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
    @Req() req,
  ): any {
    const file = req.file;
    return this.ChallengeService.patchChallengeAuth(
      challenge_id,
      authentication_id,
      file,
    );
  }

  // 테스트 (s3 이미지 delete 요청)
  @Delete('/challengeAuth/:challenge_id/:authentication_id')
  deleteChallengeAuth(
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
  ): any {
    return this.ChallengeService.deleteChallengeAuth(
      challenge_id,
      authentication_id,
    );
  }
}
