import { Controller, Get, HttpStatus, Param, ParseIntPipe, Res } from '@nestjs/common';
import { VehicleSelectionService } from './vehicle-selection.service';
import { Response } from 'express';


@Controller('vehicle')
export class VehicleSelectionController {
    constructor(private readonly VehicleSelectionService: VehicleSelectionService){}

    // todo: add guard principle of handling request
    @Get("getTypes/:wheels")
    async getVehicleTypes(
        @Param('wheels',ParseIntPipe) wheels:number,
        @Res() res: Response
    ){
        try {
            const types = await this.VehicleSelectionService.findTypesByWheels(wheels);
            return res.status(HttpStatus.OK).json({ error: false, data: types });
        } catch (err) {
            console.log("error getting vehicle types",err)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Internal server error',
            });

        }
    }


    // todo: add guard principle of handling request
    @Get('getRide/:id')
    async getRide(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response,
    ) {
        try {
        const vehicles = await this.VehicleSelectionService.getVehiclesByType(id);
        return res.status(HttpStatus.OK).json({
            error: false,
            data: vehicles,
        });
        } catch (err) {
        console.error('Error fetching vehicles:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: 'Internal server error',
        });
        }
    }

}
