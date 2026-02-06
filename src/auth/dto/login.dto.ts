import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({example: "john@gmail.com"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({example: "changeme"})
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
