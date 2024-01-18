import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { host: string; port: number } {
    // 예시로 더미 데이터를 반환하도록 설정하였습니다. 실제 데이터에 맞게 수정하세요.
    return { host: 'localhost', port: 3000 };
  }
}
