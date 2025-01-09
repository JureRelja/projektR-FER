import { Signalling } from "./signalling/Signalling";

const servers = {
    iceServers: [
        { urls: "stun:stun.ekiga.net" },
        { urls: "stun:stun.schlund.de" },
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.voipbuster.com" },
        { urls: "stun:stun.voipstunt.com" },
        { urls: "stun:stun.xten.com" },
        { urls: "relay1.expressturn.com:3478", username: "efKQFKTVZ46CD0JGNE", password: "CbUyVUAn6AAc595o" },
    ],
};

export class WebRTC {
    private peerConnection: RTCPeerConnection = new RTCPeerConnection(servers);
    private signalling: Signalling;

    private remoteParticipant: MediaStream = new MediaStream();
    private status: "Connected" | "Not connected " = "Not connected ";
    private iceCandidates: RTCIceCandidate[] = [];

    constructor(signalling: Signalling) {
        this.signalling = signalling;
    }

    getPeerConnection() {
        return this.peerConnection;
    }

    getStatus(): string {
        return this.status;
    }

    getIceCandidates(): RTCIceCandidate[] {
        return this.iceCandidates;
    }

    private async getUserMedia(): Promise<MediaStream | undefined> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            return stream;
        } catch (error) {
            console.error("Error accessing media devices.", error);
        }
    }

    private async createConnection(
        thisParticipantVideo: React.RefObject<HTMLVideoElement>,
        remoteParticipantVideo: React.RefObject<HTMLVideoElement>,
        sendIce: boolean,
    ): Promise<void> {
        const stream = await this.getUserMedia();

        if (!stream) {
            return;
        }

        if (thisParticipantVideo.current) {
            thisParticipantVideo.current.srcObject = stream;
            thisParticipantVideo.current.muted = true;
        }

        //Adding local tracks to peerConnection
        stream.getTracks().forEach((track) => this.peerConnection.addTrack(track, stream));

        //Media from the other peer
        this.peerConnection.ontrack = function (event) {
            setRemoteStream(event);
        };

        const setRemoteStream = (event: RTCTrackEvent) => {
            event.streams[0].getTracks().forEach((track) => {
                this.remoteParticipant.addTrack(track);
            });

            if (remoteParticipantVideo.current) {
                remoteParticipantVideo.current.srcObject = this.remoteParticipant;
            }
        };

        // Listen for local ICE candidates on the local RTCPeerConnection
        this.peerConnection.addEventListener("icecandidate", (event) => {
            if (event.candidate) {
                if (!sendIce) {
                    this.iceCandidates.push(event.candidate);
                } else {
                    this.signalling.emitIceCandidate({ iceCandidate: event.candidate });
                }
            }
        });

        this.peerConnection.addEventListener("connectionstatechange", () => {
            if (this.peerConnection.connectionState === "connected") {
                alert("Peers connected");
            }
        });

        // Listen for remote ICE candidates and add them to the local RTCPeerConnection
        this.signalling.listenForIceCandidate(this.peerConnection);
    }

    public async createAndSendOffer(
        thisParticipantVideo: React.RefObject<HTMLVideoElement>,
        remoteParticipantVideo: React.RefObject<HTMLVideoElement>,
    ): Promise<RTCSessionDescriptionInit | null> {
        await this.createConnection(thisParticipantVideo, remoteParticipantVideo, false);

        const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        return offer;
    }

    public async createAndSendAnswer(
        thisParticipantVideo: React.RefObject<HTMLVideoElement>,
        remoteParticipantVideo: React.RefObject<HTMLVideoElement>,
        sdp: string,
        sdpType: RTCSdpType,
    ): Promise<RTCSessionDescriptionInit | null> {
        await this.createConnection(thisParticipantVideo, remoteParticipantVideo, true);

        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ sdp: sdp, type: sdpType }));

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        return answer;
    }
}
