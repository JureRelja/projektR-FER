import { Participant } from "../types/Participant";

export interface Signalling {
    makeAnswer(answer: RTCSessionDescriptionInit, callerId: string | number): void;

    startCall(offer: RTCSessionDescriptionInit, roomId: number): void;

    gettingCalled(
        setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        createAndSendAnswer: (
            data: { offer: RTCSessionDescriptionInit; socketId: string },
            setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
            setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        ) => void,
    ): void;

    answerMade(peerConnection: RTCPeerConnection): void;

    getRoomData(
        setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
        setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    ): void;
}
