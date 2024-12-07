import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { ParticipantEntity } from "./entities/participant.entity";
import { Participant, Role } from "@prisma/client";

@Injectable()
export class ParticipantRepository {
    constructor() {}

    public async getParticipants(roomUUID: string): Promise<ParticipantEntity[]> {
        const participants: ParticipantEntity[] = await db.participant.findMany({
            where: {
                room: {
                    uuid: roomUUID,
                },
            },
        });

        return participants;
    }

    public async createParticipant(name: string, socketId: string, roomUUID: string): Promise<Participant> {
        const newParticipant: Participant = await db.participant.create({
            data: {
                name: name,
                role: Role.PARTICIPANT,
                socketId: socketId,
                room: {
                    connect: {
                        uuid: roomUUID,
                    },
                },
            },
        });

        return newParticipant;
    }
}
