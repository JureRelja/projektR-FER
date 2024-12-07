import { Message } from "../types/Message";

export interface Signalling {
    joinRoom(roomUUID: string): void;

    getUserId(): string;

    emitMessage(message: Message): void;

    listenForMessage(): void;

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void;

    answerMade(peerConnection: RTCPeerConnection, fetchParticipantData: () => Promise<void>): void;

    removeAnswerMade(): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
