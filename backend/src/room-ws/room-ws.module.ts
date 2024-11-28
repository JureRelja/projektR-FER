import { Module } from "@nestjs/common";
import { RoomWsService } from "./room-ws.service";
import { RoomWsGateway } from "./room-ws.gateway";
import { ParticipantsService } from "src/participants/participants.service";
import { RoomService } from "src/room/room.service";
import { ParticipantRepository } from "src/participants/ParticipantRepository";
import { RoomRepository } from "src/room/RoomRepository";

@Module({
    providers: [RoomWsGateway, RoomWsService, ParticipantsService, RoomService, ParticipantRepository, RoomRepository],
})
export class RoomWsModule {}
