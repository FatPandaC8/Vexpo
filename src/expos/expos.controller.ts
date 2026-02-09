import { Controller, Get, Param } from '@nestjs/common';
import { ExposService } from './expos.service';

@Controller('expos')
export class ExposController {
  constructor(private expoService: ExposService) {}

  @Get()
  async findAllExpos() {
    return this.expoService.findAll();
  }

  @Get(':id')
  async findExpoById(@Param('expoId') expoId: number) {
    return this.expoService.findExpoById(expoId);
  }

  @Get(':id/booths')
  async findAllBoothsByExpoId(@Param('expoId') expoId: number) {
    return this.expoService.findAllBoothByExpoId(expoId);
  }
}
