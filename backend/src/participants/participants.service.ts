import { Injectable } from "@nestjs/common";
import { ParticipantEntity } from "./entities/participant.entity";
import { ParticipantRepository } from "./ParticipantRepository";

@Injectable()
export class ParticipantsService {
    constructor(private readonly participantRepository: ParticipantRepository) {}

    async findOne(socketId: string): Promise<ParticipantEntity | null> {
        return this.participantRepository.getParticipantBySocketId(socketId);
    }

    async findMany(roomId: number): Promise<ParticipantEntity[]> {
        return this.participantRepository.getParticipants(roomId);
    }

    async createParticipant(roomId: number, socketId: string): Promise<ParticipantEntity> {
        return await this.participantRepository.createParticipant(roomId, socketId);
    }
}
