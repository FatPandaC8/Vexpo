import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDTO {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string

  @ApiProperty({ example: 'john@email.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ example: 'exhibitor', required: false })
  @IsOptional()
  @IsString()
  role?: string
}