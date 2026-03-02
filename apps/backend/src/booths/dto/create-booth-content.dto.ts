import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { MAP_ROWS, MAP_COLS } from './update-booth.dto';

export class CreateBoothContentDTO {
  @ApiProperty({ example: 'TechCorp Booth' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'We showcase innovative tech solutions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiProperty({
    example: 'models/booth.glb',
    description:
      "Absolute path to the 3D model file saved on the exhibitor's local machine",
    required: false,
  })
  @IsString()
  @IsOptional()
  modelPath?: string;

  @ApiProperty({ example: 2, description: `Floor map row (0–${MAP_ROWS - 1})` })
  @IsInt()
  @Min(0)
  @Max(MAP_ROWS - 1)
  mapRow?: number;

  @ApiProperty({
    example: 3,
    description: `Floor map column (0–${MAP_COLS - 1})`,
  })
  @IsInt()
  @Min(0)
  @Max(MAP_COLS - 1)
  mapCol?: number;
}
