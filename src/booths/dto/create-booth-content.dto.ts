import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateBoothContentDTO {
  @ApiProperty({ example: 'TechCorp Booth' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'We showcase innovative tech solutions' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  companyId?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  content?: {
    logo?: string;
    bannerImage?: string;
    videos?: string[];
    documents?: string[];
    products?: any[];
  };
}
