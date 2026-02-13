import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { Log } from 'src/entities/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
