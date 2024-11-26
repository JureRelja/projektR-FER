import { Socket } from "socket.io-client";
import { Signalling } from "../Signalling";
import { Participant } from "../../types/Participant";

export class WebSocketSignalling implements Signalling {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    answerMade(peerConnection: RTCPeerConnection): void {
        this.socket.on("answerMade", async (data) => {
            console.log(data);
            if (data.caleeSocketId != this.socket.id) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });
    }

    getRoomData(
        setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    ): void {
        this.socket.on("roomData", (data: Participant[]) => {
            console.log(data);

            setParticipant1(data[0]);
            setParticipant2(data[1]);
        });
    }
}
