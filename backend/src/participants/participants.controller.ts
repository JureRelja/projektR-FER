import { Controller, Get, Param, Post } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantEntity } from "./entities/participant.entity";

@Controller("participants")
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    @Get(":socketId")
    async findOne(@Param("socketId") socketId: string): Promise<ParticipantEntity | null> {
        return this.participantsService.findOne(socketId);
    }

    @Post("update/:socketId")
    async updateParticipant(@Param("socketId") socketId: string, offer: RTCSessionDescriptionInit): Promise<void> {
        await this.participantsService.updateParticipantDetails(offer, socketId);
    }
}
