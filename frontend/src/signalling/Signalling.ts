export interface Signalling {
    joinRoom(roomId: string): void;

    getUserId(): string;

    answerMade(peerConnection: RTCPeerConnection): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
