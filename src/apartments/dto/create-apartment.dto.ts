import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ResidentDto } from './resident.dto';

export class CreateApartmentDto {
  @IsNumber()
  _id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResidentDto)
  residents: ResidentDto[];

  @IsNumber()
  balance: number;
}
