import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomWsService } from "./room-ws.service";
import { MessageDto } from "./dto/MessageDto";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly roomWsService: RoomWsService) {}

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: { roomUUID: string; answer: RTCSessionDescriptionInit }, @ConnectedSocket() answerClient: Socket): void {
        this.roomWsService.emitCallAnswer(callAnswer.answer, answerClient, callAnswer.roomUUID);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() room: { roomUUID: string }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomWsService.socketJoinRoom(room.roomUUID, client);
    }

    @SubscribeMessage("iceCandidate")
    async recieveIceCandidate(@MessageBody() candidate: { iceCandidate: RTCIceCandidate }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomWsService.recieveIceCandidate(candidate, client, this.server);
    }

    @SubscribeMessage("message")
    async gotMessage(@MessageBody() message: MessageDto, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomWsService.sendMessage(message, client, this.server);
    }
}
