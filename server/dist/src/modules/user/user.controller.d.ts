import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUserDto(login_type: string, createUserDto: CreateUserDto): any;
}
