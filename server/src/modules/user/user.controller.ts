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

  @UseGuards(JwtService)
  @Post('/register/:type')
  createUserDto(
    @Param('type') login_type: string,
    @Body() createUserDto: CreateUserDto,
  ): any {
    console.log('register controller body', createUserDto);
    return this.userService.createNewUser(login_type, createUserDto);
  }

  @UseGuards(JwtService)
  @Post('/profileUpload/:type')
  postProfileUpload(
    @Param('type') login_type: string,
    @Body() body: any,
    @Req() req,
  ): any {
    console.log('profileUpload controller body', body);
    console.log('controller postProfileUpload', req.file);
    const file = req.file;
    return this.userService.postProfileUpload(login_type, body, file);
  }

  // 마이페이지 조회
  // @Get('/myPage/:userid_num')
  // getMyPage(@Param('userid_num') userid_num: number, @Req() req) {
  @UseGuards(JwtService)
  @Get('/myPage')
  async getMyPage(@Req() req, @Req() request: Request) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    console.log('myPage controller userid_num > ', userid_num);
    // console.log('myPage controller req.file > ', req.file);
    const file = req.file;
    return this.userService.getMyPage(userid_num, file);
  }

  // 마이페이지 수정
  @UseGuards(JwtService)
  @Patch('/myPage')
  async patchMyPage(@Body() body: any, @Req() req: Request) {
    const userInfo = req.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;
    // const file = req.file;
    // return this.userService.patchMyPage(userid_num, file, body);
  }

  @Get('score/:userid')
  getScore(@Param('userid') userid: number) {
    return this.userService.getScore(userid);
  }

  //결제페이지
  @UseGuards(JwtService)
  @Get('/checkout/success')
  success(@Res() res: Response, @Req() req: Request) {
    console.log('controller success');
    console.log('/checkout/success res >>>>>>>>>', res.req.url);
    // res.sendFile('./../../../../client/src/page/CheckoutSuccess.tsx');
    return res.send('success');
    // Redirect('/checkout/success');
  }

  @UseGuards(JwtService)
  @Post('/checkout')
  tossPayment(@Body() paymentDTO: PaymentDTO, @Res() res, @Req() req: Request) {
    console.log('/checkout req >>>>>>>>>');
    console.log('/checkout res >>>>>>>>>');
    return this.userService.tossPayment(paymentDTO);
  }
  // async success(
  //   @Body() body: PaymentDTO,
  //   @Res() res: Response,
  //   @Req() req: Request,
  // ) {
  //   console.log('controller body > ', body);
  //   console.log('controller res > ', res);
  //   console.log('controller req > ', req);
  //   return await this.userService.successPay(body, res);
  //   return;
  // }

  @UseGuards(JwtService)
  @Get('/ranking')
  async getRank(@Res() res: Response) {
    console.log('현재 랭킹');
    const rank = await this.userService.rank();
    return res.send(rank);
  }

  @UseGuards(JwtService)
  @Get('/myRanking')
  async getMyRank(@Req() req: Request, @Res() res: Response) {
    const myInfo = req.headers['authorization'].split(' ')[1];
    console.log('🚀 ~ getMyRank ~ myInfo:', myInfo);

    const decodedUserInfo = await this.jwtService.verify(myInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    console.log('🚀 ~ getMyRank ~ decodedUserInfo:', decodedUserInfo);

    const userid_num = decodedUserInfo.userid_num;
    console.log('🚀 ~ getMyRank ~ userid_num:', userid_num);
    const rank = await this.userService.myRank(userid_num);
    console.log('🚀 ~ getMyRank ~ rank:', rank);

    return res.send(String(rank));
  }
}
