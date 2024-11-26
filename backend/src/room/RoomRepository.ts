import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { RoomEntity } from "./entities/Room.entity";
import { Participant, Role } from "@prisma/client";

@Injectable()
export class RoomRepository {
    constructor() {}

    public async createRoom(socketId: string): Promise<RoomEntity> {
        const newRoom: RoomEntity = await db.room.create({
            data: {
                name: "New room",
                participants: {
                    create: {
                        socketId: socketId,
                        role: Role.MODERATOR,
                    },
                },
            },
        });

        return newRoom;
    }

    public async joinRoom(roomId: number, socketId: string): Promise<Participant> {
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
