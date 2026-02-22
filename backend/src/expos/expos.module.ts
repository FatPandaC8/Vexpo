import { Module } from '@nestjs/common';
import { ExposController } from './expos.controller';
import { ExposService } from './expos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';
import { Expo } from 'src/entities/expo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expo, Booth])],
  exports: [ExposService, TypeOrmModule],
  controllers: [ExposController],
  providers: [ExposService],
})
export class ExposModule {}
