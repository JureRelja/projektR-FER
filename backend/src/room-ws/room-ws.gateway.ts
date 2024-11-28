import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { RoomService } from "../room/room.service";
import { Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: RTCSessionDescriptionInit, @ConnectedSocket() answerClient: Socket): void {
        this.roomService.emitCallAnswer(callAnswer, answerClient);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() roomId: number, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.socketJoinRoom(roomId, client);
    }
}
