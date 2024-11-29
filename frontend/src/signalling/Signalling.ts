export interface Signalling {
    answerMade(peerConnection: RTCPeerConnection): void;

    emitIceCandidate(data: { iceCandidate: RTCIceCandidate }): void;

    listenForIceCandidate(peerConnection: RTCPeerConnection): void;
}
