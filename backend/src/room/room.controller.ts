import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomEntity } from "./entities/Room.entity";
import { UpdateRoomDto } from "./dto/UpdateRoom";
import { CreateParticipantDto } from "../participants/dto/CreateParticipantDto";

@Controller("/rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get("/:roomId")
    async getRoom(@Param("roomId") roomUUID: string): Promise<RoomEntity | null> {
        return await this.roomService.getRoom(roomUUID);
    }

    @Post("/create")
    async createRoom(@Body() createParticipant: CreateParticipantDto): Promise<RoomEntity> {
        return await this.roomService.createRoom(createParticipant);
    }

    @Post("/:roomUUID")
    async joinRoom(@Param("roomUUID") roomUUID: string, @Body() createParticipant: CreateParticipantDto): Promise<RoomEntity | null> {
        return await this.roomService.joinRoom(roomUUID, createParticipant);
    }

    @Patch("/:roomUUID")
    async updateRoom(@Param("roomUUID") roomUUID: string, @Body() updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return this.roomService.updateRoomSdp(roomUUID, updateRoomDto);
    }
}
