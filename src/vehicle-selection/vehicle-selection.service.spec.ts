import { Test, TestingModule } from '@nestjs/testing';
import { VehicleSelectionService } from './vehicle-selection.service';

describe('VehicleTypeService', () => {
  let service: VehicleSelectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleSelectionService],
    }).compile();

    service = module.get<VehicleSelectionService>(VehicleSelectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
