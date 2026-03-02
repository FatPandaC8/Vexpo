import { Module } from '@nestjs/common';
import { BoothsController } from './booths.controller';
import { BoothsService } from './booths.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booth])],
  exports: [BoothsService, TypeOrmModule],
  controllers: [BoothsController],
  providers: [BoothsService],
})
export class BoothsModule {}
