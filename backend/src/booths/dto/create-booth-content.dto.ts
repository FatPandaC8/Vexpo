import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateBoothContentDTO {
  @ApiProperty({ example: 'TechCorp Booth' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'We showcase innovative tech solutions', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  companyId?: number;

  @ApiProperty({
    example: 'C:/Users/john/models/booth.glb',
    description: 'Absolute path to the 3D model file saved on the exhibitor\'s local machine',
    required: false,
  })
  @IsString()
  @IsOptional()
  modelPath?: string;
}