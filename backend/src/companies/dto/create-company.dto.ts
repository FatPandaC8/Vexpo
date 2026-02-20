import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterCompanyDTO {
  @ApiProperty({ example: 'TechCorp Inc.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  industry: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: 'Hanoi' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'contact@techcorp.com' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'https://techcorp.com', required: false })
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'Leading tech company' })
  @IsString()
  @IsOptional()
  description: string;
}
