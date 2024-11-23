import { Injectable } from "@nestjs/common";
import { ParticipantEntity } from "./entities/participant.entity";
import { ParticipantRepository } from "./ParticipantRepository";

@Injectable()
export class ParticipantsService {
    constructor(private readonly participantRepository: ParticipantRepository) {}

    async findOne(socketId: string): Promise<ParticipantEntity | null> {
        return this.participantRepository.getParticipantBySocketId(socketId);
    }

    async findMany(roomId: string): Promise<ParticipantEntity[]> {
        const roomIdNum: number = parseInt(roomId);

        if (isNaN(roomIdNum)) {
            throw new Error("Invalid room id");
        }

        return this.participantRepository.getParticipants(roomIdNum);
    }
}
