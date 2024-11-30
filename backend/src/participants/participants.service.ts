import { Injectable } from "@nestjs/common";
import { ParticipantEntity } from "./entities/participant.entity";
import { ParticipantRepository } from "./ParticipantRepository";

@Injectable()
export class ParticipantsService {
    constructor(private readonly participantRepository: ParticipantRepository) {}

    async findMany(roomUUID: string): Promise<ParticipantEntity[]> {
        return this.participantRepository.getParticipants(roomUUID);
    }

    async createParticipant(roomUUID: string, socketId: string): Promise<ParticipantEntity> {
        return await this.participantRepository.createParticipant(roomUUID, socketId);
    }
}
