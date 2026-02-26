import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class OAuthCompleteDTO {
  @ApiProperty({ example: 'EXHIBITOR' })
  @IsString()
  @IsIn(['exhibitor', 'organizer'])
  role: 'exhibitor' | 'organizer';
}
