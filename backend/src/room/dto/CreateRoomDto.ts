import { Socket } from "socket.io";

export class CreateRoomDto {
    offer: RTCSessionDescriptionInit;
    socket: Socket;
}
