export type Participant = {
    id: string;
    role: "MODERATOR" | "PARTICIPANT";
    sdp: string;
    sdpType: string;
    roomId: number;
    stream: MediaStream | null;
    socketId: string;
};
