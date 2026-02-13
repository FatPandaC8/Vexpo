import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateReportStatusDto {
  @ApiProperty({ enum: ['pending', 'reviewed', 'resolved', 'dismissed'] })
  @IsEnum(['pending', 'reviewed', 'resolved', 'dismissed'])
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}