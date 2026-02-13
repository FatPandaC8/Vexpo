import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'Inappropriate content' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: 'Detailed description of the issue' })
  @IsString()
  @IsOptional()
  description?: string;
}