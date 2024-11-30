import { Controller, Get, Param } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantEntity } from "./entities/participant.entity";

@Controller("participants")
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    @Get(":roomUUID")
    async findManyByRoomUUID(@Param("roomUUID") roomUUID: string): Promise<ParticipantEntity[]> {
        return this.participantsService.findMany(roomUUID);
    }
}
