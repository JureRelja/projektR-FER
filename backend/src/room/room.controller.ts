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

    @Post("/:roomUUID")
    async joinRoom(@Param("roomUUID") roomUUID: string, @Query("socketId") socketId: string): Promise<RoomEntity | null> {
        return await this.roomService.joinRoom(roomUUID, socketId);
    }

    @Patch("/:roomUUID")
    async updateRoom(@Param("roomUUID") roomUUID: string, @Body() updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return this.roomService.updateRoomSdp(roomUUID, updateRoomDto);
    }
}
