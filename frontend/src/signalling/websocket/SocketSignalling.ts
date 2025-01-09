import { Socket } from "socket.io-client";
import { Signalling } from "../Signalling";
import { Message } from "../../types/Message";

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

    emitMessage(message: Message): void {
        this.socket.emit("message", message);
    }

    listenForMessage(handleNewMessage: (message: Message) => void): void {
        this.socket.on("message", (message: Message) => {
            handleNewMessage(message);
        });
    }

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void {
        console.log("Answerer sending ICE candidate to other peer", data);
        this.socket.emit("iceCandidate", data);
    }

    listenForIceCandidate(peerConnection: RTCPeerConnection): void {
        this.socket.on("iceCandidate", async (data) => {
            try {
                console.log("Received ICE candidate from other peer", data.iceCandidate);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
            } catch (e) {
                console.error("Error adding received ice candidate", e);
            }
        });
    }

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void {
        this.socket.emit("makeAnswer", { roomUUID: roomUUID, answer: answer });
    }

    answerMade(peerConnection: RTCPeerConnection, fetchParticipantData: () => Promise<void>, iceCandidates: RTCIceCandidate[]): void {
        this.socket.on("answerMade", async (data) => {
            if (!peerConnection.remoteDescription) {
                console.log("connecting " + data.caleeSocketId + " and " + this.socket.id);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                fetchParticipantData();

                iceCandidates.forEach((candidate) => {
                    console.log("Emiting sandidate to the callee", candidate);
                    this.emitIceCandidate({ iceCandidate: candidate });
                });
            }
        });
    }

    removeAnswerMade(): void {
        this.socket.off("answerMade");
    }
}
