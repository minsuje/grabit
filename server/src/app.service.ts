import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';


@Injectable()
export class AppService {
  constructor(
    @Inject(appConfig.KEY)
    private config: ConfigType<typeof appConfig>,
  ) {}

  getHello() {
    const host = this.config.host;
    const port = this.config.port;
    return {
      host,
      port,
    };
  }
}

