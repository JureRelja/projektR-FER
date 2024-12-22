import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { RoomWsService } from "./room-ws.service";
import { MessageDto } from "./dto/MessageDto";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
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
        this.roomWsService.recieveIceCandidate(candidate, client);
    }

    @SubscribeMessage("message")
    async gotMessage(@MessageBody() message: MessageDto, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomWsService.sendMessage(message, client);
    }
}
