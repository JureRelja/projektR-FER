import { Module } from "@nestjs/common";
import { RoomModule } from "./room/room.module";
import { ParticipantsModule } from './participants/participants.module';

@Module({
    imports: [RoomModule, ParticipantsModule],
})
export class AppModule {}
