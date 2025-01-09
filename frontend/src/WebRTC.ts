import { Signalling } from "./signalling/Signalling";

const servers = {
    iceServers: [
        { url: "stun:stun01.sipphone.com" },
        { url: "stun:stun.ekiga.net" },
        { url: "stun:stun.fwdnet.net" },
        { url: "stun:stun.ideasip.com" },
        { url: "stun:stun.iptel.org" },
        { url: "stun:stun.rixtelecom.se" },
        { url: "stun:stun.schlund.de" },
        { url: "stun:stun.l.google.com:19302" },
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
        { url: "stun:stun3.l.google.com:19302" },
        { url: "stun:stun4.l.google.com:19302" },
        { url: "stun:stunserver.org" },
        { url: "stun:stun.softjoys.com" },
        { url: "stun:stun.voiparound.com" },
        { url: "stun:stun.voipbuster.com" },
        { url: "stun:stun.voipstunt.com" },
        { url: "stun:stun.voxgratia.org" },
        { url: "stun:stun.xten.com" },
        {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
        },
        {
            url: "turn:192.158.29.39:3478?transport=udp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
        },
        {
            url: "turn:192.158.29.39:3478?transport=tcp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
        },
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
                this.iceCandidates.push(event.candidate);
                console.log(sendIce, event.candidate);

                // console.log("Sending ICE candidate to other peer", event.candidate);
                if (sendIce) {
                    console.log("Answerer sending ICE candidate to other peer", event.candidate);
                    this.signalling.emitIceCandidate({ iceCandidate: event.candidate });
                }
            }
        });

        // Listen for remote ICE candidates and add them to the local RTCPeerConnection
        this.signalling.listenForIceCandidate(this.peerConnection);
    }

    public async createAndSendOffer(
        thisParticipantVideo: React.RefObject<HTMLVideoElement>,
        remoteParticipantVideo: React.RefObject<HTMLVideoElement>,
    ): Promise<RTCSessionDescriptionInit | null> {
        const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        await this.createConnection(thisParticipantVideo, remoteParticipantVideo, false);

        return offer;
    }

    public async createAndSendAnswer(
        thisParticipantVideo: React.RefObject<HTMLVideoElement>,
        remoteParticipantVideo: React.RefObject<HTMLVideoElement>,
        sdp: string,
        sdpType: RTCSdpType,
    ): Promise<RTCSessionDescriptionInit | null> {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription({ sdp: sdp, type: sdpType }));

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        await this.createConnection(thisParticipantVideo, remoteParticipantVideo, true);

        return answer;
    }
}
