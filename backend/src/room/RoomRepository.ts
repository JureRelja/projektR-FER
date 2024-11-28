import { Injectable } from "@nestjs/common";
import db from "../db/db.server";
import { RoomEntity } from "./entities/Room.entity";
import { Role } from "@prisma/client";

@Injectable()
export class RoomRepository {
    constructor() {}

    public async createRoom(socketId: string, offer: RTCSessionDescriptionInit): Promise<RoomEntity> {
        const newRoom: RoomEntity = await db.room.create({
            data: {
                name: "New room",
                sdp: offer.sdp,
                sdpType: offer.type,
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
