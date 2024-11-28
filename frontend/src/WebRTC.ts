import { Signalling } from "./signalling/Signalling";

const configuration = { iceServers: [{ urls: "stun:stun.example.org" }] };
const peerConnection = new RTCPeerConnection(configuration);

export class WebRTC {
    private peerConnection: RTCPeerConnection = new RTCPeerConnection();
    private signallingServer: Signalling;

    private participant1Stream: MediaStream | null = null;
    private participant2Stream: MediaStream | null = null;

    constructor(signallingServer: Signalling) {
        this.signallingServer = signallingServer;
    }

    async getUserMedia(): Promise<MediaStream | undefined> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }

    public async createAndSendOffer(): Promise<RTCSessionDescriptionInit | null> {
        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return null;
        }

        this.participant1Stream = stream;

        //Media from the other peer
        this.peerConnection.ontrack = function (event) {
            setParicipat2Stream(event);
        };

        const setParicipat2Stream = (event: RTCTrackEvent) => {
            this.participant2Stream = event.streams[0];
        };

        const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        return offer;
    }

    public async createAndSendAnswer(sdp: string, sdpType: RTCSdpType): Promise<void> {
        //Displaying and capturing media for the first participant
        let localStream: MediaStream | undefined;

        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return;
        }

        localStream = stream;

        this.participant2Stream = stream;

        //Media from the other peer
        this.peerConnection.ontrack = function (event) {
            setParicipat1Stream(event);
        };

        const setParicipat1Stream = (event: RTCTrackEvent) => {
            this.participant2Stream = event.streams[0];
        };

        if (localStream) {
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream as MediaStream));
            await peerConnection.setRemoteDescription(new RTCSessionDescription({ sdp: sdp, type: sdpType }));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            // this.signallingServer(answer, data.socketId);
        }
    }
}
