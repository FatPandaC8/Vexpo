import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ExposService } from './expos.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';

@ApiTags('Expos - Public')
@Controller('expos')
export class ExposController {
  constructor(private expoService: ExposService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all expos' })
  @ApiQuery({ name: 'type', required: false })
  async findAllExpos(@Query('type') type?: string) {
    return this.expoService.findAll({ type });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get expo details by ID' })
  async findExpoById(@Param('expoId', ParseIntPipe) expoId: number) {
    return this.expoService.findExpoById(expoId);
  }

  @Public()
  @Get(':id/booths')
  @ApiOperation({ description: 'Get all booths of an expo' })
  async findAllBoothsByExpoId(@Param('expoId', ParseIntPipe) expoId: number) {
    return this.expoService.findAllBoothsByExpoId(expoId);
  }
}
