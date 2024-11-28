import { Test, TestingModule } from '@nestjs/testing';
import { RoomWsGateway } from './room-ws.gateway';
import { RoomWsService } from './room-ws.service';

describe('RoomWsGateway', () => {
  let gateway: RoomWsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomWsGateway, RoomWsService],
    }).compile();

    gateway = module.get<RoomWsGateway>(RoomWsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
