import { PartialType } from "@nestjs/mapped-types";
import { CreateRoomDto } from "./CreateRoomDto";

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    id: number;
}
