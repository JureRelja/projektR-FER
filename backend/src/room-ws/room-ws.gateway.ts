import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { RoomService } from "../room/room.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: { roomId: number; answer: RTCSessionDescriptionInit }, @ConnectedSocket() answerClient: Socket): void {
        this.roomService.emitCallAnswer(callAnswer.answer, answerClient, this.server, callAnswer.roomId);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() room: { roomId: number }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.socketJoinRoom(room.roomId, client);
    }

    @SubscribeMessage("iceCandidate")
    async recieveIceCandidate(@MessageBody() candidate: { iceCandidate: RTCIceCandidate }, @ConnectedSocket() client: Socket): void {
        this.roomService.recieveIceCandidate(candidate, client, this.server);
    }
}
