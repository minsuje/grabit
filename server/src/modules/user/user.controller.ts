import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { PaymentDTO } from './dto/paymentsDto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { REPLCommand } from 'repl';

@UseGuards(JwtService)
@Controller('/')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 회원가입 (register)
  @UseGuards(JwtService)
  @Post('/register/:type')
  createUserDto(
    @Param('type') login_type: string,
    @Body() createUserDto: CreateUserDto,
  ): any {
    return this.userService.createNewUser(login_type, createUserDto);
  }

  // 아이디 중복검사 (register UserID duplicate check)
  @UseGuards(JwtService)
  @Post('/checkid')
  duplicateCheck(@Body() body: any) {
    const { userid } = body;
    return this.userService.duplicateCheck(userid);
  }

  // 회원 가입시, 이미지 업로드 (register, Img upload)
  @UseGuards(JwtService)
  @Post('/profileUpload/:type')
  postProfileUpload(
    @Param('type') login_type: string,
    @Body() body: any,
    @Req() req,
  ): any {
    const file = req.file;
    return this.userService.postProfileUpload(login_type, body, file);
  }

  // 마이페이지 조회 (Mypage)
  @UseGuards(JwtService)
  @Get('/myPage')
  async getMyPage(@Req() req, @Req() request: Request) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    const file = req.file;

    return this.userService.getMyPage(userid_num, file);
  }

  // 다른 사람 프로필 조회 (Other User Page)
  @UseGuards(JwtService)
  @Get('/profile/:userid')
  async getProfilePage(
    @Param('userid') userid: string,
    @Req() req,
    @Req() request: Request,
  ) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const login_userid_num = decodedUserInfo.userid_num;
    const file = req.file;
    return this.userService.getProfilePage(login_userid_num, userid, file);
  }

  // 마이페이지 수정 (Edit Mypage)
  @UseGuards(JwtService)
  @Patch('/myPage')
  async patchMyPage(@Body() body: any, @Req() req, @Req() request: Request) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    const login_type = decodedUserInfo.login_type;
    const file = req.file;
    return this.userService.patchMyPage(userid_num, file, body, login_type);
  }

  // @UseGuards(JwtService)
  // @Get('/profile/:userid')
  // async getProfile(@Param('userid') userid: number) {
  //   // return this.userService.getProfile(userid);
  // }

  // 점수 (score)
  @Get('score/:userid')
  getScore(@Param('userid') userid: number) {
    return this.userService.getScore(userid);
  }

  //결제페이지 (payment page)
  @UseGuards(JwtService)
  @Post('/userInfo')
  async payment(@Req() request: Request) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    return this.userService.payment(userid_num);
  }

  // 결제 승인 (payment accept)
  @UseGuards(JwtService)
  @Post('/checkout/confirm')
  async confirm(@Body() paymentDTO: PaymentDTO) {
    return this.userService.tossPayment(paymentDTO);
  }

  // 돈 업데이트 (charge User Money)
  @UseGuards(JwtService)
  @Post('/updateMoney')
  async updateMoney(@Body() body, @Req() request: Request) {
    const amount = body.amount;
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    return this.userService.updateMoney(amount, userid_num);
  }

  // 결제 성공 페이지 (payment success page)
  @UseGuards(JwtService)
  @Get('/checkout/success')
  success(@Res() res: Response, @Req() req: Request, @Req() request) {
    return res.send('success');
  }

  // 전체 랭킹 (All User Ranking)
  @UseGuards(JwtService)
  @Get('/ranking')
  async getRank() {
    const rank = await this.userService.rank();
    return rank;
  }

  // 내 랭킹 (My Ranking)
  @UseGuards(JwtService)
  @Get('/myRanking')
  async getMyRank(@Req() req: Request, @Res() res: Response) {
    const myInfo = req.headers['authorization'].split(' ')[1];

    const decodedUserInfo = await this.jwtService.verify(myInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const userid_num = decodedUserInfo.userid_num;
    const rank = await this.userService.myRank(userid_num);

    return res.send(String(rank));
  }

  // 출금 신청 (Withdrawal Application)
  @UseGuards(JwtService)
  @Post('/requsetWithdraw')
  async requestWithdraw(@Req() req: Request, @Body() change) {
    const myInfo = req.headers['authorization'].split(' ')[1];

    const decodedUserInfo = await this.jwtService.verify(myInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });

    const userid_num = decodedUserInfo.userid_num;

    return this.userService.requestWithdraw(userid_num, change);
  }
}
