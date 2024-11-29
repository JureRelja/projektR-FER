import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./RoomRepository";
import { RoomEntity } from "./entities/Room.entity";
import { Server, Socket } from "socket.io";
import { ParticipantRepository } from "src/participants/ParticipantRepository";
import { ParticipantEntity } from "src/participants/entities/participant.entity";
import { CreateRoomDto } from "./dto/CreateRoomDto";
import { UpdateRoomDto } from "./dto/UpdateRoom";

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly participantRepository: ParticipantRepository,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        const newRoom: RoomEntity = await this.roomRepository.createRoom(createRoomDto.socketId);

        return newRoom;
    }

    async updateRoomSdp(roomId: number, updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return await this.roomRepository.updateRoomSdp(roomId, { sdp: updateRoomDto.sdpOffer, type: updateRoomDto.sdpType as RTCSdpType });
    }

    async joinRoom(roomId: number, socketId: string): Promise<RoomEntity | null> {
        if (await this.canJoinRoom(roomId)) {
            await this.participantRepository.createParticipant(roomId, socketId);
            return this.roomRepository.getRoomById(roomId);
        }

        return null;
    }

    async socketJoinRoom(roomId: number, client: Socket): Promise<boolean> {
        if (!client.rooms.has(roomId.toString())) {
            await client.join(roomId.toString());

            console.log("Client " + client.id + " joined room: " + roomId);
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

    public recieveIceCandidate(candidate: { iceCandidate: RTCIceCandidate }, client: Socket, server: Server): void {
        const rooms: string[] = Array.from(client.rooms);
        console.log("emitting ice candidate");
        server.to(rooms).emit("iceCandidate", { iceCandidate: candidate.iceCandidate });
    }

    emitCallAnswer(answer: RTCSessionDescriptionInit, answerer: Socket, server: Server, roomId: number): void {
        console.log("emitting answerMade");
        server.to(roomId.toString()).emit("answerMade", { caleeSocketId: answerer.id, answer: answer });
    }
}
