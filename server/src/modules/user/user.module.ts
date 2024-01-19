import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}

export interface User {
    login_type: string;
    userid?: string;
    social_userid?: string;
    password?: string;
    name?: string;
    nickname?: string;
    profile_img?: string;
    score_num: number;
    money: number;
}
