import { IsInt, IsString, IsDateString, isString } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    firstName:string;

    @IsString()
    lastName:string;

    @IsInt()
    vehicleId:number;

    @IsDateString()
    startDate:string;

    @IsDateString()
    endDate:string;
}