import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { RoomEntity } from "./entities/Room.entity";
import { Role } from "@prisma/client";

@Injectable()
export class RoomRepository {
    constructor() {}

    public async getRoomById(roomId: number): Promise<RoomEntity | null> {
        return await db.room.findUnique({
            where: {
                id: roomId,
            },
        });
    }

    public async createRoom(socketId: string, sdpOffer: string, sdpType: string): Promise<RoomEntity> {
        const newRoom: RoomEntity = await db.room.create({
            data: {
                name: "New room",
                sdp: sdpOffer,
                sdpType: sdpType,
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

    public async updateRoomSdp(id: number, offer: RTCSessionDescriptionInit): Promise<void> {
        await db.room.update({
            where: {
                id: id,
            },
            data: {
                sdp: offer.sdp,
                sdpType: offer.type,
            },
        });
    }
}
