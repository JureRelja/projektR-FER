export type Participant = {
    id: string;
    name: string;
    role: "MODERATOR" | "PARTICIPANT";
    roomId: number;
    socketId: string;
};
