import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUser";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
