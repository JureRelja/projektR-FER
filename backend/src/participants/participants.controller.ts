import { Controller, Get, Param } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantEntity } from "./entities/participant.entity";

@Controller("participants")
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    @Get(":roomId")
    async findManyByRoomId(@Param("roomId") roomId: number): Promise<ParticipantEntity[]> {
        return this.participantsService.findMany(roomId);
    }
}
