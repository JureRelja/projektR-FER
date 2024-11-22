import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { RoomService } from "./room.service";
import { Socket } from "socket.io";

@WebSocketGateway()
export class RoomGateway {
    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("createRoom")
    async createRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket): Promise<number> {
        const roomId: number = await this.roomService.createRoom();

        await client.join(roomId.toString());

        console.log("createRoom");
        return roomId;
    }

    @SubscribeMessage("joinRoom")
    joinRoom(@MessageBody() id: number): Promise<void> {
        return this.roomService.joinRoom(id);
    }
}
