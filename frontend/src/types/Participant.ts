export type Participant = { id: string; role: "MODERATOR" | "PARTICIPANT"; roomId: number; stream: MediaStream | null; socketId: string };
