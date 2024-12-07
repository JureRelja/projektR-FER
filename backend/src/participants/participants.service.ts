import { Injectable } from "@nestjs/common";
import { ParticipantEntity } from "./entities/participant.entity";
import { ParticipantRepository } from "./ParticipantRepository";
import { CreateParticipantDto } from "./dto/CreateParticipantDto";

@Injectable()
export class ParticipantsService {
    constructor(private readonly participantRepository: ParticipantRepository) {}

    async findMany(roomUUID: string): Promise<ParticipantEntity[]> {
        return this.participantRepository.getParticipants(roomUUID);
    }

    async createParticipant(roomUUID: string, createParticipantDto: CreateParticipantDto): Promise<ParticipantEntity> {
        return await this.participantRepository.createParticipant(createParticipantDto.name, createParticipantDto.socketId, roomUUID);
    }
}
