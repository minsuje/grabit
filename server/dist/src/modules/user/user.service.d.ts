import { CreateUserDto, LoginDto } from './dto/create-user.dto';
export declare class UserService {
    createNewUser: (login_type: any, createUserDto: CreateUserDto) => Promise<import("pg").QueryResult<never>>;
    loginUser: (loginDto: LoginDto) => Promise<false | {
        password: string;
        userid_num: number;
        login_type: string;
        userid: string;
        name: string;
        social_userid: string;
        nickname: string;
        profile_img: string;
        score_num: number;
        money: number;
        created_at: Date;
        updated_at: Date;
    }[]>;
}
