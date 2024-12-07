export interface Signalling {
    joinRoom(roomUUID: string): void;

    getUserId(): string;

    emitMessage(message: string, name: string, roomUUID: string): void;

    listenForMessage(): void;

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void;

    answerMade(peerConnection: RTCPeerConnection, fetchParticipantData: () => Promise<void>): void;

    removeAnswerMade(): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
