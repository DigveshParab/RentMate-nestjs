import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { VehicleSelectionModule } from './vehicle-selection/vehicle-selection.module';

@Module({
  imports: [PrismaModule, VehicleSelectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
