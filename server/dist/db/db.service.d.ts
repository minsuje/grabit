import { ConfigType } from "@nestjs/config";
import dbConfig from "../config/db.config";
export declare class DbService {
    private config;
    constructor(config: ConfigType<typeof dbConfig>);
    getUrl(): string;
}
