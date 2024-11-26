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

    public async updateParticipantSdp(socketId: string, offer: RTCSessionDescriptionInit): Promise<void> {
        await db.participant.update({
            where: {
                socketId: socketId,
            },
            data: {
                sdp: offer.sdp,
                sdpType: offer.type,
            },
        });
    }
}
