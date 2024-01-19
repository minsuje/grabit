import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.module';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUserDto(type: string, createUserDto: CreateUserDto): User;
}
