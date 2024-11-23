import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./RoomRepository";
import { RoomEntity } from "./entities/Room.entity";
import { Socket } from "socket.io";
import { ParticipantRepository } from "src/participants/ParticipantRepository";

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly participantRepository: ParticipantRepository,
    ) {}

    async createRoom(client: Socket): Promise<number> {
        const newRoom: RoomEntity = await this.roomRepository.createRoom(client.id);

        await client.join(newRoom.id.toString());

        console.log("Client" + client.id + " joined room: " + newRoom.id);

        return newRoom.id;
    }

    async joinRoom(roomId: number, client: Socket): Promise<void> {
        const numberRoomId: number = typeof roomId === "string" ? parseInt(roomId) : roomId;

        if (isNaN(numberRoomId)) {
            throw new Error("Invalid room id");
        }

        await this.roomRepository.joinRoom(numberRoomId, client.id);

        await client.join(numberRoomId.toString());

        client.emit("roomData", this.participantRepository.getParticipants(numberRoomId));

        console.log("Client" + client.id + " joined room: " + numberRoomId);
    }
}
