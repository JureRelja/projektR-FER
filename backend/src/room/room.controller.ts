import { Controller, Get, Param, Post } from "@nestjs/common";

import { RoomService } from "./room.service";
import { MessageBody } from "@nestjs/websockets";
import { RoomEntity } from "./entities/Room.entity";
import { Socket } from "socket.io";

@Controller("rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post("create")
    async createRoom(@MessageBody() socket: Socket): Promise<RoomEntity> {
        return await this.roomService.createRoom(socket);
    }

    @Get(":roomId")
    async joinRoom(@Param("roomId") roomId: number, @MessageBody() socket: Socket): Promise<boolean> {
        return await this.roomService.joinRoom(roomId, socket);
    }
}