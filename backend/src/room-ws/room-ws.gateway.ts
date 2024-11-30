import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { RoomService } from "../room/room.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: { roomUUID: string; answer: RTCSessionDescriptionInit }, @ConnectedSocket() answerClient: Socket): void {
        this.roomService.emitCallAnswer(callAnswer.answer, answerClient, this.server, callAnswer.roomUUID);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() room: { roomUUID: string }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.socketJoinRoom(room.roomUUID, client);
    }

    @SubscribeMessage("iceCandidate")
    async recieveIceCandidate(@MessageBody() candidate: { iceCandidate: RTCIceCandidate }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.recieveIceCandidate(candidate, client, this.server);
    }
}
