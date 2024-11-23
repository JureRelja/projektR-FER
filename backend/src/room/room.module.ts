import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { RoomRepository } from "./RoomRepository";
import { ParticipantsModule } from "src/participants/participants.module";

@Module({
    providers: [RoomGateway, RoomService, RoomRepository],
    imports: [ParticipantsModule],
})
export class RoomModule {}
