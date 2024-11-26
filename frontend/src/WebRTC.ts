import { Participant } from "./types/Participant";
import { Signalling } from "./signalling/Signalling";

const configuration = { iceServers: [{ urls: "stun:stun.example.org" }] };
const peerConnection = new RTCPeerConnection(configuration);

export class WebRTC {
    private peerConnection: RTCPeerConnection;
    private signallingServer: Signalling;

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

    public async createAndSendOffer(
        roomId: number,
        setParicipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    ): Promise<void> {
        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return;
        }

        setParicipant1((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = stream;
            }

            return newParticipant;
        });

        //Media from the other peer
        this.peerConnection.ontrack = function (event) {
            setParticipant2((prev) => {
                const newParticipant = prev;

                if (newParticipant) {
                    newParticipant.stream = event.streams[0];
                }

                return newParticipant;
            });
        };

        const offer: RTCSessionDescriptionInit = await this.peerConnection.createOffer();

        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        this.signallingServer.startCall(offer, roomId);
    }

    public async createAndSendAnswer(
        data: { offer: RTCSessionDescriptionInit; socketId: string },
        setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    ): Promise<void> {
        //Displaying and capturing media for the first participant
        let localStream: MediaStream | undefined;

        //Displaying and capturing media for the first participant
        const stream = await this.getUserMedia();

        if (!stream) {
            return;
        }

        localStream = stream;

        setParticipant2((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = stream;
            }

            return newParticipant;
        });

        //Media from the other peer
        peerConnection.ontrack = function (event) {
            setParticipant1((prev) => {
                const newParticipant = prev;

                if (newParticipant) {
                    newParticipant.stream = event.streams[0];
                }

                return newParticipant;
            });
        };

        if (localStream) {
            localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream as MediaStream));
            console.log(data);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

            this.signallingServer.makeAnswer(answer, data.socketId);
        }
    }
}
