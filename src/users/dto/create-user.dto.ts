// src/users/dto/create-user.dto.ts

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthMethod, UserRole } from 'src/schemas/user.schema';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  number: number;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.REGULAR;

  @IsEnum(AuthMethod)
  @IsOptional()
  auth_method?: AuthMethod = AuthMethod.CREDENTIALS;
}
