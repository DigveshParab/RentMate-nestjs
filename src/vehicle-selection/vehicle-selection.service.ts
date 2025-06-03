import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehicleSelectionService {
    constructor(private prisma: PrismaService) {}

    async findTypesByWheels(wheels: number) {
        return this.prisma.vehicleType.findMany({
        where: { wheels },
        });
    }

    async getVehiclesByType(vehicleTypeId: number) {
        return this.prisma.vehicle.findMany({
        where: {
            vehicleTypeId,
        },
        });
    }


}
