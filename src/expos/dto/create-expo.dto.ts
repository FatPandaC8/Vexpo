import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateExpoDTO {
  @ApiProperty({ example: 'Tech Expo 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Technology' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '2024-06-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-05' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'The biggest tech expo of the year' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://techexpo2024.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;
}
