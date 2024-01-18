import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import dbConfig from "../config/db.config";

@Injectable()
export class DbService {
  constructor(
    @Inject(dbConfig.KEY)
    private config: ConfigType<typeof dbConfig>
  ) {}

  getUrl() {
    const { user, password, host, port, name } = this.config;
    return `${user}:${password}@${host}:${port}/${name}`;
  }
}
