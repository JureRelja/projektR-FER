import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class RoomWsService {
    public recieveIceCandidate(candidate: { iceCandidate: RTCIceCandidate }, client: Socket): void {
        const rooms: string[] = Array.from(client.rooms);
        console.log("emitting ice candidate");
        client.broadcast.to(rooms).emit("iceCandidate", { iceCandidate: candidate.iceCandidate });

        // server.to(rooms).emit("iceCandidate", { iceCandidate: candidate.iceCandidate });
    }

    async socketJoinRoom(roomUUID: string, client: Socket): Promise<boolean> {
        if (!client.rooms.has(roomUUID)) {
            await client.join(roomUUID);

            console.log("Client " + client.id + " joined room: " + roomUUID);
        }

        return true;
    }

    emitCallAnswer(answer: RTCSessionDescriptionInit, answerer: Socket, roomUUID: string): void {
        console.log("emitting answerMade");
        answerer.broadcast.to(roomUUID).emit("answerMade", { caleeSocketId: answerer.id, answer: answer });
    }

    sendMessage(message: { message: string; roomUUID: string }, client: Socket): void {
        console.log("emitting message");
        client.broadcast.to(message.roomUUID).emit("message", message);
    }
}
