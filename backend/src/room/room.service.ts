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

    async getRoom(roomUUID: string): Promise<RoomEntity | null> {
        return await this.roomRepository.getRoomByUUID(roomUUID);
    }

    async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
        const newRoom: RoomEntity = await this.roomRepository.createRoom(createRoomDto.socketId);

        return newRoom;
    }

    async updateRoomSdp(roomUUID: string, updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return await this.roomRepository.updateRoomSdp(roomUUID, { sdp: updateRoomDto.sdpOffer, type: updateRoomDto.sdpType as RTCSdpType });
    }

    async joinRoom(roomUUID: string, socketId: string): Promise<RoomEntity | null> {
        if (await this.canJoinRoom(roomUUID)) {
            await this.participantRepository.createParticipant(roomUUID, socketId);
            return this.roomRepository.getRoomByUUID(roomUUID);
        }

        return null;
    }

    async socketJoinRoom(roomUUID: string, client: Socket): Promise<boolean> {
        if (!client.rooms.has(roomUUID)) {
            await client.join(roomUUID);

            console.log("Client " + client.id + " joined room: " + roomUUID);
        }

        return true;
    }

    private async canJoinRoom(roomUUID: string): Promise<boolean> {
        const peopleInRoom: ParticipantEntity[] = await this.participantRepository.getParticipants(roomUUID);

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

    emitCallAnswer(answer: RTCSessionDescriptionInit, answerer: Socket, server: Server, roomUUID: string): void {
        console.log("emitting answerMade");
        server.to(roomUUID).emit("answerMade", { caleeSocketId: answerer.id, answer: answer });
    }
}
