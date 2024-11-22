import { Injectable } from "@nestjs/common";
import { RoomRepository } from "./repository/RoomRepository";
import { RoomEntity } from "./entities/Room.entity";

@Injectable()
export class RoomService {
    constructor(private readonly roomRepository: RoomRepository) {}

    async createRoom(): Promise<number> {
        const newRoom: RoomEntity = await this.roomRepository.createRoom();

        return newRoom.id;
    }

    async joinRoom(roomId: number): Promise<void> {
        await this.roomRepository.joinRoom(roomId);
        return undefined;
    }
}
