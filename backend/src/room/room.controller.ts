import { Body, Controller, Param, Post } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomEntity } from "./entities/Room.entity";
import { CreateRoomDto } from "./dto/CreateRoomDto";

@Controller("/rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post("/create")
    async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        return await this.roomService.createRoom(createRoomDto);
    }

    @Post("/:roomId")
    async joinRoom(@Param("roomId") roomId: number, @Body() socketId: string): Promise<boolean> {
        return await this.roomService.joinRoom(roomId, socketId);
    }
}
