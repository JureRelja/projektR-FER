import { Signalling } from "./signalling/Signalling";

const configuration = { iceServers: [{ urls: "stun:stun.example.org" }] };
const peerConnection = new RTCPeerConnection(configuration);

export class WebRTC {
    private peerConnection: RTCPeerConnection;
    private signallingServer: Signalling;

    private participant1Stream: MediaStream | null = null;
    private participant2Stream: MediaStream | null = null;

    constructor(peerConnection: RTCPeerConnection, signallingServer: Signalling) {
        this.peerConnection = peerConnection;
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

    public async createAndSendOffer(socketId: string): Promise<void> {
        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return;
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

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/update/${socketId}`, {
            body: JSON.stringify({
                offer,
            }),
            method: "POST",
        });

        const data = await response.json();
    }

    public async createAndSendAnswer(roomId: number): Promise<void> {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/`);

        const data = await response.json();

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
            console.log(data);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            this.signallingServer(answer, data.socketId);
        }
    }
}
