import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.module';
export declare class UserService {
    private user;
    createNewUser(createUserDto: CreateUserDto): User;
}
