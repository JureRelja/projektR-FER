import { Controller, Get, Param, Post } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantEntity } from "./entities/participant.entity";
import { CreateParticipantDto } from "./dto/CreateParticipantDto";

@Controller("participants")
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    @Get(":socketId")
    async findOne(@Param("socketId") socketId: string): Promise<ParticipantEntity | null> {
        return this.participantsService.findOne(socketId);
    }

    // @Post("new")
    // async createParticipant(@MessageBody() createParticipantDto: CreateParticipantDto): Promise<ParticipantEntity> {
    //     return this.participantsService.createParticipant(createParticipantDto);
    // }
}
