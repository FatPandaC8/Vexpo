import { Controller, Get, Param } from '@nestjs/common';
import { BoothsService } from './booths.service';

@Controller('booths')
export class BoothsController {
  constructor(private boothService: BoothsService) {}

  @Get(':id')
  async getBoothById(@Param('booth id') boothId: number) {
    return this.boothService.getBoothById(boothId);
  }
}
