import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'TechCorp Inc.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Hanoi' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'contact@techcorp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://techcorp.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'Leading tech company' })
  @IsString()
  @IsNotEmpty()
  description: string;
}