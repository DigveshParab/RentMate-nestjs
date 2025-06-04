import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Response } from 'express';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingsService){}

    @Post('create')
    async createBooking(
        @Body() dto : CreateBookingDto,
        @Res() res : Response
    ){
        try {
            const result = await this.bookingService.createBooking(dto);
            return res.status(HttpStatus.OK).json({error: false, message: result.message});

        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: true, message: err.message });
        }
    }

    @Post('check_availability')
    async checkAvailability(@Body() dto: CheckAvailabilityDto) {
        try {
            console.log(dto)
            const result = await this.bookingService.checkAvailability(dto);
            return {
                error: false,
                available: result.available,
                message: result.available ? 'Vehicle is available' : 'Vehicle is not available for the selected dates',
            };
        } catch (error) {
            return {
                error: true,
                message: 'Internal server error while checking availability',
            };
        }
    }


}
