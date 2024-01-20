import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}

export interface User {
    createUserDto: CreateUserDto;
}
