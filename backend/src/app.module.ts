import { Module } from "@nestjs/common";
import { RoomModule } from "./room/room.module";
import { ParticipantsModule } from "./participants/participants.module";
import { RoomWsModule } from "./room-ws/room-ws.module";

@Module({
    imports: [RoomModule, ParticipantsModule, RoomWsModule],
})
export class AppModule {}
