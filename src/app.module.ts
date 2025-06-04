import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { VehicleSelectionModule } from './vehicle-selection/vehicle-selection.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, VehicleSelectionModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
