import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { ParticipantEntity } from "./entities/participant.entity";

@Injectable()
export class ParticipantRepository {
    constructor() {}

    public async getParticipantBySocketId(socketId: string): Promise<ParticipantEntity | null> {
        const participant: ParticipantEntity | null = await db.participant.findUnique({
            where: {
                socketId: socketId,
            },
        });

        return participant;
    }

    public async getParticipants(roomId: number): Promise<ParticipantEntity[]> {
        const participants: ParticipantEntity[] = await db.participant.findMany({
            where: {
                roomId: roomId,
            },
        });

        return participants;
    }
}
