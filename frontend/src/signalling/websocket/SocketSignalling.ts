import { Socket } from "socket.io-client";
import { Signalling } from "../Signalling";

export class WebSocketSignalling implements Signalling {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
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

    answerMade(peerConnection: RTCPeerConnection): void {
        this.socket.on("answerMade", async (data) => {
            console.log("andwerMade", data);
            if (data.caleeSocketId != this.socket.id) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });
    }
}
