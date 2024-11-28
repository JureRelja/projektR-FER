import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomRepository } from "./RoomRepository";
import { ParticipantsModule } from "src/participants/participants.module";
import { RoomController } from "./room.controller";

@Module({
    controllers: [RoomController],
    providers: [RoomService, RoomRepository],
    imports: [ParticipantsModule],
    exports: [RoomService, RoomRepository],
})
export class RoomModule {}
