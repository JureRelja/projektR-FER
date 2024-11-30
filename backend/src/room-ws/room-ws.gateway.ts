import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { RoomService } from "../room/room.service";
import { Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class RoomWsGateway {
    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("makeAnswer")
    answerCall(@MessageBody() callAnswer: { roomUUID: string; answer: RTCSessionDescriptionInit }, @ConnectedSocket() answerClient: Socket): void {
        this.roomService.emitCallAnswer(callAnswer.answer, answerClient, callAnswer.roomUUID);
    }

    @SubscribeMessage("joinRoom")
    async joinRoom(@MessageBody() room: { roomUUID: string }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.socketJoinRoom(room.roomUUID, client);
    }

    @SubscribeMessage("iceCandidate")
    async recieveIceCandidate(@MessageBody() candidate: { iceCandidate: RTCIceCandidate }, @ConnectedSocket() client: Socket): Promise<void> {
        this.roomService.recieveIceCandidate(candidate, client);
    }
}
