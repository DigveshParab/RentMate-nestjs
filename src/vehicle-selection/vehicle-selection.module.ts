import { Module } from '@nestjs/common';
import { VehicleSelectionController } from './vehicle-selection.controller';
import { VehicleSelectionService} from './vehicle-selection.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VehicleSelectionController],
  providers: [VehicleSelectionService,PrismaService]
})
export class VehicleSelectionModule {}
