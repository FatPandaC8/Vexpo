import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDTO {
  @ApiProperty({ example: 'exhibitor' })
  @IsString()
  @IsNotEmpty()
  role: string;
}
