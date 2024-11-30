import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomEntity } from "./entities/Room.entity";
import { CreateRoomDto } from "./dto/CreateRoomDto";
import { UpdateRoomDto } from "./dto/UpdateRoom";

@Controller("/rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get("/:roomId")
    async getRoom(@Param("roomId") roomUUID: string): Promise<RoomEntity | null> {
        return await this.roomService.getRoom(roomUUID);
    }

    @Post("/create")
    async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        return await this.roomService.createRoom(createRoomDto);
    }

    @Post("/:roomId")
    async joinRoom(@Param("roomId") roomId: number, @Query("socketId") socketId: string): Promise<RoomEntity | null> {
        return await this.roomService.joinRoom(roomId, socketId);
    }

    @Patch("/:roomId")
    async updateRoom(@Param("roomId") roomId: number, @Body() updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return this.roomService.updateRoomSdp(roomId, updateRoomDto);
    }
}
