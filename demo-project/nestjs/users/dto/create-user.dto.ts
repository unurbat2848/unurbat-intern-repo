import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}