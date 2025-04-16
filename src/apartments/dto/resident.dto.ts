import { IsBoolean, IsString } from 'class-validator';

export class ResidentDto {
  @IsString()
  name: string;

  @IsBoolean()
  owner: boolean;
}
