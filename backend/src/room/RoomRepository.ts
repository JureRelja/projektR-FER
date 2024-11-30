import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { RoomEntity } from "./entities/Room.entity";
import { Role } from "@prisma/client";

@Injectable()
export class RoomRepository {
    constructor() {}

    public async getRoomByUUID(roomUUID: string): Promise<RoomEntity | null> {
        return await db.room.findUnique({
            where: {
                uuid: roomUUID,
            },
        });
    }

    public async getRoomById(roomId: number): Promise<RoomEntity | null> {
        return await db.room.findUnique({
            where: {
                id: roomId,
            },
        });
    }

    public async createRoom(socketId: string): Promise<RoomEntity> {
        const newRoom: RoomEntity = await db.room.create({
            data: {
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

    public async updateRoomSdp(roomUUID: string, offer: RTCSessionDescriptionInit): Promise<RoomEntity | null> {
        return await db.room.update({
            where: {
                uuid: roomUUID,
            },
            data: {
                sdp: offer.sdp,
                sdpType: offer.type,
            },
        });
    }
}
