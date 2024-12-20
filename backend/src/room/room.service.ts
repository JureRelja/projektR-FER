import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./RoomRepository";
import { RoomEntity } from "./entities/Room.entity";
import { ParticipantRepository } from "src/participants/ParticipantRepository";
import { ParticipantEntity } from "src/participants/entities/participant.entity";
import { CreateRoomDto } from "./dto/CreateRoomDto";
import { UpdateRoomDto } from "./dto/UpdateRoom";
import { CreateParticipantDto } from "src/participants/dto/CreateParticipantDto";

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
        const newRoom: RoomEntity = await this.roomRepository.createRoom(createRoomDto.socketId, createRoomDto.name);

        return newRoom;
    }

    async updateRoomSdp(roomUUID: string, updateRoomDto: UpdateRoomDto): Promise<RoomEntity | null> {
        return await this.roomRepository.updateRoomSdp(roomUUID, { sdp: updateRoomDto.sdpOffer, type: updateRoomDto.sdpType as RTCSdpType });
    }

    async joinRoom(roomUUID: string, createParticipant: CreateParticipantDto): Promise<RoomEntity | null> {
        if (await this.canJoinRoom(roomUUID)) {
            await this.participantRepository.createParticipant(createParticipant.name, createParticipant.socketId, roomUUID);
            return this.roomRepository.getRoomByUUID(roomUUID);
        }

        return null;
    }

    private async canJoinRoom(roomUUID: string): Promise<boolean> {
        const peopleInRoom: ParticipantEntity[] = await this.participantRepository.getParticipants(roomUUID);

        if (peopleInRoom.length >= 2) {
            return false;
        }
        return true;
    }
}
