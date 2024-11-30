export type Participant = {
    id: string;
    role: "MODERATOR" | "PARTICIPANT";
    roomId: number;
    socketId: string;
};
