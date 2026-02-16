import { Module } from '@nestjs/common';
import { ExposController } from './expos.controller';
import { ExposService } from './expos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booth } from 'src/entities/booth.entity';
import { Registration } from 'src/entities/registration.entity';
import { Expo } from 'src/entities/expo.entity';
import { ExposAdminController } from './expos.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Expo, Booth, Registration])],
  exports: [ExposService, TypeOrmModule],
  controllers: [ExposController, ExposAdminController],
  providers: [ExposService],
})
export class ExposModule {}
