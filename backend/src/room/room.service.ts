import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./RoomRepository";
import { RoomEntity } from "./entities/Room.entity";
import { Socket } from "socket.io";
import { ParticipantRepository } from "src/participants/ParticipantRepository";
import { ParticipantEntity } from "src/participants/entities/participant.entity";

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

    async joinRoom(roomId: number, client: Socket): Promise<boolean> {
        const numberRoomId: number = typeof roomId === "string" ? parseInt(roomId) : roomId;

        const peopleInRoom: ParticipantEntity[] = await this.participantRepository.getParticipants(numberRoomId);

        if (peopleInRoom.length >= 2) {
            return false;
        }

        await this.roomRepository.joinRoom(numberRoomId, client.id);

        await client.join(numberRoomId.toString());

        client.emit("roomData", await this.participantRepository.getParticipants(numberRoomId));

        console.log("Client" + client.id + " joined room: " + numberRoomId);

        return true;
    }

    async makeCall(offer: RTCSessionDescriptionInit, caller: Socket): Promise<void> {
        const room: SetIterator<[string, string]> = caller.rooms.entries();

        await this.participantRepository.updateParticipantSdp(caller.id, caller, offer);
    }

    emitCallAnswer(answer: RTCSessionDescriptionInit, answerer: Socket): void {
        answerer.emit("answerMade", { caleeSocketId: answerer.id, answer: answer });
    }
}
