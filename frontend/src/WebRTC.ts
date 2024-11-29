import { Signalling } from "./signalling/Signalling";
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const peerConnection = new RTCPeerConnection(configuration);

export class WebRTC {
    private peerConnection: RTCPeerConnection = new RTCPeerConnection();
    private signalling: Signalling;

    private participant1Stream: MediaStream | null = null;
    private participant2Stream: MediaStream | null = null;
    private status: "Connected" | "Not connected " = "Connected";

    constructor(signalling: Signalling) {
        this.signalling = signalling;
    }

    getPeerConnection(): RTCPeerConnection {
        return this.peerConnection;
    }

    getParticipant1Stream(): MediaStream | null {
        return this.participant1Stream;
    }

    getParticipant2Stream(): MediaStream | null {
        return this.participant2Stream;
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
            console.log("participant2", event);
            this.participant2Stream = event.streams[0];
        };

        const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        this.peerConnection.addEventListener("connectionstatechange", (event) => {
            if (peerConnection.connectionState === "connected") {
                this.status = "Connected";
            }
        });

        // Listen for local ICE candidates on the local RTCPeerConnection
        peerConnection.addEventListener("icecandidate", (event) => {
            if (event.candidate) {
                this.signalling.emitIceCandidate({ iceCandidate: event.candidate });
            }
        });

        // Listen for remote ICE candidates and add them to the local RTCPeerConnection
        this.signalling.listenForIceCandidate(this.peerConnection);

        return offer;
    }

    public async createAndSendAnswer(sdp: string, sdpType: RTCSdpType): Promise<RTCSessionDescriptionInit | null> {
        //Displaying and capturing media for the first participant
        let localStream: MediaStream | undefined;

        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return null;
        }

        localStream = stream;

        this.participant2Stream = stream;

        //Media from the other peer
        this.peerConnection.ontrack = function (event) {
            setParicipat1Stream(event);
        };

        const setParicipat1Stream = (event: RTCTrackEvent) => {
            console.log("participant1", event);
            this.participant1Stream = event.streams[0];
        };

        this.peerConnection.addEventListener("connectionstatechange", (event) => {
            if (peerConnection.connectionState === "connected") {
                this.status = "Connected";
            }
        });

        // Listen for local ICE candidates on the local RTCPeerConnection
        peerConnection.addEventListener("icecandidate", (event) => {
            if (event.candidate) {
                this.signalling.emitIceCandidate({ iceCandidate: event.candidate });
            }
        });

        // Listen for remote ICE candidates and add them to the local RTCPeerConnection
        this.signalling.listenForIceCandidate(this.peerConnection);

        if (localStream) {
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream as MediaStream));
            await peerConnection.setRemoteDescription(new RTCSessionDescription({ sdp: sdp, type: sdpType }));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            return answer;
        }
        return null;
    }
}
