import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';


// Use try/catch in services that perform important write operations.

@Injectable()
export class BookingsService {
    constructor(private Prisma: PrismaService){}

    async createBooking(dto: CreateBookingDto) {
        const { firstName, lastName, vehicleId, startDate, endDate } = dto;

        try {
            const booking = await this.Prisma.booking.create({
            data: {
                name: `${firstName} ${lastName}`,
                vehicleId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
            });

            if (!booking) {
            return { error: true, message: 'Booking failed to create' };
            }

            return { error: false, message: 'Booking successful' };
        } catch (err) {
            throw new InternalServerErrorException('Error while booking');
        }
    }



    async checkAvailability(dto: CheckAvailabilityDto) {
        const { vehicleId, startDate, endDate } = dto;

        const overlapping = await this.Prisma.booking.findFirst({
            where: {
            vehicleId: vehicleId,
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
            },
        });

        return { available: !overlapping };
    }

}
