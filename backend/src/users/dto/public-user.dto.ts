import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PublicUserInfo {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name: string | undefined;
}
