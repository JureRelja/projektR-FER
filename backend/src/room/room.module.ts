import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RoomRepository } from "./repository/RoomRepository";

@Module({
    providers: [RoomGateway, RoomService, RoomRepository],
})
export class RoomModule {}
