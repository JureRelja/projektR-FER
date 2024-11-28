import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { ParticipantEntity } from "./entities/participant.entity";
import { Participant, Role } from "@prisma/client";

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

    public async createParticipant(roomId: number, socketId: string): Promise<Participant> {
        const newParticipant: Participant = await db.participant.create({
            data: {
                role: Role.PARTICIPANT,
                socketId: socketId,
                roomId: roomId,
            },
        });

        return newParticipant;
    }
}
