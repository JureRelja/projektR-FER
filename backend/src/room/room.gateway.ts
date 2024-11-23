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

        console.log("Client" + client.id + " joined room: " + roomId);
        return roomId;
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() id: number, @ConnectedSocket() client: Socket): Promise<void> {
        await this.roomService.joinRoom(typeof id === "string" ? parseInt(id) : id);

        await client.join(id.toString());

        console.log("Client" + client.id + " joined room: " + id);
    }
}
