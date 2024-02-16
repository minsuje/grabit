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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('/')
export class ChallengeController {
  constructor(
    private ChallengeService: ChallengeService,
    private jwtService: JwtService,
  ) {}

  // 챌린지 생성
  @UseGuards(JwtAuthGuard)
  @Post('/challengeCreate')
  async postChallengeCreate(@Body() body: ChallengeDto, @Req() req) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    //  { userid_num: 35,nickname: 'yewon',name: '김예원',,,,, }

    const userid_num = decodedUserInfo.userid_num;
    const nickname = decodedUserInfo.nickname;
    return this.ChallengeService.newChallenge(userid_num, nickname, body);
  }

  // 챌린지 수락하기
  @UseGuards(JwtAuthGuard)
  @Patch('/challengeAccept/:challenge_id')
  async challengeAccept(
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    return this.ChallengeService.challengeAccept(userid_num, challenge_id);
  }

  // 챌린지 거절하기
  @UseGuards(JwtAuthGuard)
  @Patch('/challengeReject/:challenge_id')
  async challengeReject(
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    const nickname = decodedUserInfo.nickname;
    return this.ChallengeService.challengeReject(
      userid_num,
      nickname,
      challenge_id,
    );
  }

  // 챌린지 목록
  @UseGuards(JwtAuthGuard)
  @Get('/challengeList')
  async getChallengeList(@Req() req) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    return this.ChallengeService.challengeList(userid_num);
  }

  // 인기 있는 챌린지 주제
  @Get('/popularChallenge')
  getPopularChallenge(): any {
    return this.ChallengeService.getPopularChallenge();
  }

  // 챌린지 상세 정보 보기
  @UseGuards(JwtAuthGuard)
  @Get('/challengeDetail/:challenge_id')
  async getChallengeDetail(
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    return this.ChallengeService.challengeDetail(
      userid_num,
      challenge_id,
      req.file,
    );
  }

  // 챌린지 상세 정보 보기 점수 업데이트
  @UseGuards(JwtAuthGuard)
  @Post('/challengeDetail/:challenge_id')
  async postChallengeDetail(
    @Param('challenge_id') challenge_id: number,
    @Body() winner,
    @Req() request: Request,
    @Req() req,
  ) {
    // const { winner_user, total_money } = winner;
    const userInfo = request.headers['authorization'].split(' ')[1];

    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    console.log('winner > ', winner);
    const userid_num = decodedUserInfo.userid_num;
    const challengerInfo = req.file;

    // this.ChallengeService.challengeScore(winner);
    return this.ChallengeService.challengeWinner(
      winner,
      challenge_id,
      userid_num,
      challengerInfo,
    );
  }

  // 챌린지 수정 페이지 보기
  @Get('/challengeEdit/:challenge_id')
  async getChallengeEdit(@Param('challenge_id') challenge_id: number) {
    return this.ChallengeService.getChallengeEdit(challenge_id);
  }

  // 챌린지 수정하기
  @UseGuards(JwtAuthGuard)
  @Patch('/challengeEdit/:challenge_id')
  patchChallengeEdit(
    @Param('challenge_id') challenge_id: number,
    @Body() body: ChallengeDto,
  ): any {
    return this.ChallengeService.patchChallengeEdit(body, challenge_id);
  }

  // 챌린지 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete('/challengeEdit/:challenge_id')
  deleteChallengeEdit(@Param('challenge_id') challenge_id: number): any {
    return this.ChallengeService.deleteChallengeEdit(challenge_id);
  }

  // 챌린지 인증사진 상세 보기
  @UseGuards(JwtAuthGuard)
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

  // 챌린지 인증사진 올리기
  @UseGuards(JwtAuthGuard)
  @Post('/challengeAuth/:challenge_id')
  async newChallengeAuth(
    @Body() body: any,
    @Param('challenge_id') challenge_id: number,
    @Req() req,
  ) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    const file = req.file;
    return this.ChallengeService.newChallengeAuth(
      userid_num,
      challenge_id,
      file,
    );
  }

  // 챌린지 인증사진에 대한 이모티콘 요청
  @Post('/challengeAuth/:challenge_id/:authentication_id')
  async newChallengeAuthEmoticon(
    @Body() body: any,
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
    @Req() req,
  ) {
    // 로그인한 유저의 정보 찾기
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    return this.ChallengeService.newChallengeAuthEmoticon(
      userid_num,
      body,
      challenge_id,
      authentication_id,
    );
  }

  // 챌린지 인증사진에 대한 이모티콘 취소 요청
  @Delete(
    '/challengeAuth/:challenge_id/:authentication_id/:authentication_img_emoticon_id',
  )
  async deleteChallengeAuthEmoticon(
    @Param('challenge_id') challenge_id: number,
    @Param('authentication_id') authentication_id: number,
    @Param('authentication_img_emoticon_id')
    authentication_img_emoticon_id: number,
    @Req() req: Request,
  ) {
    const userInfo = req.headers['authorization'].split(' ')[1];

    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const userid_num = decodedUserInfo.userid_num;

    return await this.ChallengeService.deleteChallengeAuthEmoticon(
      challenge_id,
      authentication_id,
      authentication_img_emoticon_id,
      userid_num,
    );
  }

  // 챌린지 인증 이미지 patch 요청
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

  // 챌린지 인증 이미지 delete 요청
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

  // 챌린지 히스토리 조회
  // @Get('/history/:userid_num') getChallengeHistory(
  //   @Param('userid_num') userid_num: number,
  @Get('/history')
  async getChallengeHistory(@Req() req: Request) {
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    return await this.ChallengeService.getChallengeHistory(userid_num);
  }
}
