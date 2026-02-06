import { Module } from '@nestjs/common';
import { ExposController } from './expos.controller';
import { ExposService } from './expos.service';
import { ServiceController } from './service/service.controller';

@Module({
  controllers: [ExposController, ServiceController],
  providers: [ExposService]
})
export class ExposModule {}
