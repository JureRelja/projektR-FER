export interface Signalling {
    joinRoom(roomId: string): void;

    getUserId(): string;

    emitAnswer(answer: RTCSessionDescriptionInit, roomUUID: string): void;

    answerMade(peerConnection: RTCPeerConnection): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
