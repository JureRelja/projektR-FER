import { Participant } from "../types/Participant";

export interface Signalling {
    answerMade(peerConnection: RTCPeerConnection): void;

    getRoomData(
        setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    ): void;
}
