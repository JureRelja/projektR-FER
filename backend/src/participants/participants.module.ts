import { Module } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantsController } from "./participants.controller";
import { ParticipantRepository } from "./ParticipantRepository";

@Module({
    controllers: [ParticipantsController],
    providers: [ParticipantsService, ParticipantRepository],
    exports: [ParticipantsService, ParticipantRepository],
})
export class ParticipantsModule {}
