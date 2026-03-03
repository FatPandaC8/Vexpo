import { MAP_COLS, MAP_ROWS } from '@vexpo/schema';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateBoothDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  modelPath?: string;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAP_ROWS - 1)
  mapRow?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAP_COLS - 1)
  mapCol?: number;
}
