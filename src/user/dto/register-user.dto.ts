import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  password: string;
}

export class CreateUserInputDto {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}
