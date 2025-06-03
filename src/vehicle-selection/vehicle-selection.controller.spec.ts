import { Test, TestingModule } from '@nestjs/testing';
import { VehicleSelectionController } from './vehicle-selection.controller';

describe('VehicleTypeController', () => {
  let controller: VehicleSelectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleSelectionController],
    }).compile();

    controller = module.get<VehicleSelectionController>(VehicleSelectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
