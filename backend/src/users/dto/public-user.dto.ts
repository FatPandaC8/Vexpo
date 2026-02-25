import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class PublicUserInfo {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name: string | undefined

  @ApiProperty({ example: 'john@email.com', required: false })
  @IsEmail()
  email: string | undefined
}