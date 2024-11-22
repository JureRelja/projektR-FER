import { Room } from "@prisma/client";

export type RoomEntity = Room;

// export const roomEnity: Prisma.RoomSelect = {
//     name: true,
//     id: true,

// } satisfies Prisma.RoomSelect;

// export type RoomEntity = Prisma.RoomGetPayload<{
//     include: typeof roomEnity;
// }>;
