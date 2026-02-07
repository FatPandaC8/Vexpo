import { Module } from '@nestjs/common';
import { ExposController } from './expos.controller';
import { ExposService } from './expos.service';

@Module({
  controllers: [ExposController],
  providers: [ExposService],
})
export class ExposModule {}
