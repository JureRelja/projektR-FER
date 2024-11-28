import { Controller, Get, Param } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantEntity } from "./entities/participant.entity";

@Controller("participants")
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService) {}

    // @Get(":socketId")
    // async findOne(@Param("socketId") socketId: string): Promise<ParticipantEntity | null> {
    //     return this.participantsService.findOne(socketId);
    // }

    @Get("/:roomId")
    async findManyByRoomId(@Param("roomId") roomId: number): Promise<ParticipantEntity[]> {
        return this.participantsService.findMany(roomId);
    }

    // @Post("new")
    // async createParticipant(@Body() createParticipantDto: CreateParticipantDto): Promise<ParticipantEntity> {
    //     return this.participantsService.createParticipant(createParticipantDto);
    // }
}
