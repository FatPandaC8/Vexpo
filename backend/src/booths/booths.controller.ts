import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BoothsService } from './booths.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';

@ApiTags('Booths - Public')
@Controller('booths')
export class BoothsController {
  constructor(private boothService: BoothsService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get booth details by ID' })
  async getBoothById(@Param('id', ParseIntPipe) boothId: number) {
    return this.boothService.getBoothById(boothId);
  }
}
