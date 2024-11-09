import { PartialType } from "@nestjs/mapped-types";
import { CreateRoomDto } from "./CreateRoom";

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    id: number;
}
