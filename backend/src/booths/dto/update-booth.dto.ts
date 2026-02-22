import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export const MAP_ROWS = 5
export const MAP_COLS = 6

export class UpdateBoothDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  modelPath?: string

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAP_ROWS - 1)
  mapRow?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAP_COLS - 1)
  mapCol?: number
}