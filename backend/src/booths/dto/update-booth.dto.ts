import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

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
}
