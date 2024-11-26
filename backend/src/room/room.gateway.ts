import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { RoomService } from "./room.service";
import { Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class RoomGateway {
    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("createRoom")
    async createRoom(@ConnectedSocket() client: Socket): Promise<number> {
        return await this.roomService.createRoom(client);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket): Promise<boolean> {
        return this.roomService.joinRoom(data.roomId, client);
    }

    @SubscribeMessage("makeCall")
    makeCall(@MessageBody() callOffer: RTCSessionDescriptionInit, @ConnectedSocket() callerClient: Socket): void {
        this.roomService.makeCall(callOffer, callerClient);
    }

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: RTCSessionDescriptionInit, @ConnectedSocket() answerClient: Socket): void {
        this.roomService.emitCallAnswer(callAnswer, answerClient);
    }
}
