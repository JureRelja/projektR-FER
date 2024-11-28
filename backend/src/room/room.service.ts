import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./RoomRepository";
import { RoomEntity } from "./entities/Room.entity";
import { Socket } from "socket.io";
import { ParticipantRepository } from "src/participants/ParticipantRepository";
import { ParticipantEntity } from "src/participants/entities/participant.entity";
import { CreateRoomDto } from "./dto/CreateRoomDto";

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly participantRepository: ParticipantRepository,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        const newRoom: RoomEntity = await this.roomRepository.createRoom(createRoomDto.socketId, createRoomDto.sdpOffer, createRoomDto.sdpType);

        return newRoom;
    }

    async joinRoom(roomId: number, socketId: string): Promise<boolean> {
        if (await this.canJoinRoom(roomId)) {
            await this.participantRepository.createParticipant(roomId, socketId);
            return true;
        }

        return false;
    }

    async socketJoinRoom(roomId: number, client: Socket): Promise<boolean> {
        const numberRoomId: number = typeof roomId === "string" ? parseInt(roomId) : roomId;

        if (await this.canJoinRoom(numberRoomId)) {
            await client.join(roomId.toString());

            console.log("Client" + client.id + " joined room: " + roomId);
        }

        return true;
    }

    private async canJoinRoom(roomId: number): Promise<boolean> {
        const peopleInRoom: ParticipantEntity[] = await this.participantRepository.getParticipants(roomId);

        if (peopleInRoom.length >= 2) {
            return false;
        }
        return true;
    }

    emitCallAnswer(answer: RTCSessionDescriptionInit, answerer: Socket): void {
        answerer.emit("answerMade", { caleeSocketId: answerer.id, answer: answer });
    }
}
