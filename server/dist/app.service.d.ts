import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
export declare class AppService {
    private config;
    constructor(config: ConfigType<typeof appConfig>);
    getHello(): {
        host: string;
        port: number;
    };
}
