export interface Signalling {
    joinRoom(roomUUID: string): void;

    getUserId(): string;

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void;

    answerMade(peerConnection: RTCPeerConnection): void;

    removeAnswerMade(): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
