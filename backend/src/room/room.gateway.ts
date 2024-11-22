import { WebSocketGateway, SubscribeMessage, MessageBody } from "@nestjs/websockets";
import { RoomService } from "./room.service";

@WebSocketGateway()
export class RoomGateway {
    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("createRoom")
    createRoom(): Promise<number> {
        return this.roomService.createRoom();
    }

    @SubscribeMessage("joinRoom")
    joinRoom(@MessageBody() id: number): Promise<void> {
        return this.roomService.joinRoom(id);
    }

    @SubscribeMessage("removeRoom")
    remove(@MessageBody() id: number) {
        return this.roomService.remove(id);
    }
}
