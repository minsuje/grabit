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
  @UseGuards(JwtService)
  @Get('/myPage')
  async getMyPage(@Req() req, @Req() request: Request) {
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    // console.log('myPage controller req.file > ', req.file);
    const file = req.file;
    return this.userService.getMyPage(userid_num, file);
  }

  // 다른 사람 프로필 조회
  @UseGuards(JwtService)
  @Get('/profile/:userid')
  async getProfilePage(
    @Param('userid') userid: string,
    @Req() req,
    @Req() request: Request,
  ) {
    console.log('myPage controller req.file > ', req.file);
    const file = req.file;
    return this.userService.getProfilePage(userid, file);
  }

  // 마이페이지 수정
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

  @UseGuards(JwtService)
  @Get('/profile/:userid')
  async getProfile(@Param('userid') userid: number) {
    // return this.userService.getProfile(userid);
  }

  @Get('score/:userid')
  getScore(@Param('userid') userid: number) {
    return this.userService.getScore(userid);
  }

  //결제페이지
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

  @UseGuards(JwtService)
  @Post('/checkout/confirm')
  async confirm(@Body() paymentDTO: PaymentDTO) {
    return this.userService.tossPayment(paymentDTO);
  }

  @UseGuards(JwtService)
  @Post('/updpateMoney')
  async updateMoney(@Body() body, @Req() request: Request) {
    const amount = body.amount;
    const userInfo = request.headers['authorization'].split(' ')[1];
    const decodedUserInfo = await this.jwtService.verify(userInfo, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const userid_num = decodedUserInfo.userid_num;

    return this.userService.updateMoney(amount, userid_num);
  }

  @UseGuards(JwtService)
  @Get('/checkout/success')
  success(@Res() res: Response, @Req() req: Request, @Req() request) {
    console.log('controller success');
    console.log('/checkout/success res >>>>>>>>>', res.req.url);

    return res.send('success');
  }

  @UseGuards(JwtService)
  @Get('/ranking')
  async getRank() {
    console.log('현재 랭킹');
    const rank = await this.userService.rank();
    return rank;
  }

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
}
