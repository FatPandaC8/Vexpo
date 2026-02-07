import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class OAuthCompleteDTO {
  @ApiProperty({ example: 'EXHIBITOR' })
  @IsString()
  @IsIn(['visitor', 'exhibitor', 'organizer'])
  role: 'visitor' | 'exhibitor' | 'organizer';
}
