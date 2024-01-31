import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { PaymentDTO } from './dto/paymentsDto';
import { UserService } from './user.service';

@Controller('/')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register/:type')
  createUserDto(
    @Param('type') login_type: string,
    @Body() createUserDto: CreateUserDto,
  ): any {
    console.log('register controller body', createUserDto);
    return this.userService.createNewUser(login_type, createUserDto);
  }

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
  @Get('/myPage/:userid_num')
  getMyPage(@Param('userid_num') userid_num: number, @Req() req) {
    console.log('myPage controller req.file > ', req.file);
    const file = req.file;
    return this.userService.getMyPage(userid_num, file);
  }

  // 마이페이지 수정
  @Patch('/myPage/:userid_num')
  patchMyPage(
    @Body() body: any,
    @Param('userid_num') userid_num: number,
    @Req() req,
  ) {
    console.log('myPage controller req.file > ', req.file);
    const file = req.file;
    return this.userService.patchMyPage(userid_num, file, body);
  }

  @Get('score/:userid')
  getScore(@Param('userid') userid: number) {
    return this.userService.getScore(userid);
  }

  //결제페이지
  @Get('/checkout/success')
  success(@Res() res: Response, @Req() req: Request) {
    console.log('controller success');
    console.log('req.user >>>> ', req.user);
    // console.log(res);
    // res.sendFile('./../../../../client/src/page/CheckoutSuccess.tsx');
    return res.send('success');
    // Redirect('/checkout/success');
  }

  @Post('/checkout')
  tossPayment(@Body() paymentDTO: PaymentDTO, @Req() req: Request) {
    console.log('post service url > ', req);
    console.log('post seevice >> ', paymentDTO);
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
}
