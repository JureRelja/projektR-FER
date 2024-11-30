import { Socket } from "socket.io-client";
import { Signalling } from "../Signalling";

export class WebSocketSignalling implements Signalling {
    private socket: Socket;

    constructor(socket: Socket) {
        socket.connect();
        this.socket = socket;
    }

    joinRoom(roomUUID: string): void {
        this.socket.emit("joinRoom", {
            roomUUID: roomUUID,
        });
    }

    getUserId(): string {
        return this.socket.id as string;
    }

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void {
        this.socket.emit("iceCandidate", data);
    }

    listenForIceCandidate(peerConnection: RTCPeerConnection): void {
        this.socket.on("iceCandidate", async (data) => {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
            } catch (e) {
                console.error("Error adding received ice candidate", e);
            }
        });
    }

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void {
        this.socket.emit("makeAnswer", { roomUUID: roomUUID, answer: answer });
    }

    answerMade(peerConnection: RTCPeerConnection): void {
        this.socket.on("answerMade", async (data) => {
            console.log("answerMade", data);

            if (data.caleeSocketId != this.socket.id && !peerConnection.remoteDescription) {
                console.log("connecting " + data.caleeSocketId + " and " + this.socket.id);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });
    }

    removeAnswerMade(): void {
        this.socket.off("answerMade");
    }
}
