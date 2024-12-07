import { Test, TestingModule } from "@nestjs/testing";
import { RoomWsService } from "./room-ws.service";

describe("RoomWsService", () => {
    let service: RoomWsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RoomWsService],
        }).compile();

        service = module.get<RoomWsService>(RoomWsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
