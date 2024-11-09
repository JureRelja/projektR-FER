import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/CreateUser";
import { UpdateUserDto } from "./dto/UpdateUser";

@Injectable()
export class UserService {
    create(createUserDto: CreateUserDto): string {
        return "This action adds a new user";
    }

    findAll(): string {
        return `This action returns all user`;
    }

    findOne(id: number): string {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto): string {
        return `This action updates a #${id} user`;
    }

    remove(id: number): string {
        return `This action removes a #${id} user`;
    }
}
