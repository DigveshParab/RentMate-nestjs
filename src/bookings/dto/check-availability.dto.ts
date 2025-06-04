import { IsInt, IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsInt()
  vehicleId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
