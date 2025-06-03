import { Controller, Get, HttpStatus, Param, ParseIntPipe, Res } from '@nestjs/common';
import { VehicleSelectionService } from './vehicle-selection.service';
import { Response } from 'express';


@Controller('vehicle')
export class VehicleSelectionController {
    constructor(private readonly VehicleSelectionService: VehicleSelectionService){}

    @Get("getTypes/:wheels")
    async getVehicleTypes(
        @Param('wheels', ParseIntPipe) wheels: number,
        @Res() res: Response,
    ) {
        try {
            const types = await this.VehicleSelectionService.findTypesByWheels(wheels);

            // Guard clause: No types found
            if (!types || types.length === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    message: `No vehicle types found for ${wheels} wheels`,
                });
            }

            // Success response
            return res.status(HttpStatus.OK).json({
                error: false,
                data: types,
            });

        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Internal server error',
            });
        }
    }


    @Get('getRide/:id')
    async getRide(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response,
    ) {
        try {
            const vehicles = await this.VehicleSelectionService.getVehiclesByType(id);

            // Guard clause: no vehicles found
            if (!vehicles || vehicles.length === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    message: `No vehicles found for vehicle type ID ${id}`,
                });
            }

            // Success case
            return res.status(HttpStatus.OK).json({
                error: false,
                data: vehicles,
            });

        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Internal server error',
            });
        }
    }


}
