import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    createNewUser: (login_type: any, createUserDto: CreateUserDto) => Promise<QueryResult<import("drizzle-orm").Assume<this["row"], QueryResultRow>>>;
}
