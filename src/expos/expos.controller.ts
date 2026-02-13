import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ExposService } from './expos.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-auth.guard';

@ApiTags('Expos - Public')
@Controller('expos')
export class ExposController {
  constructor(private expoService: ExposService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all expos' })
  async findAllExpos() {
    return this.expoService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get expo details by ID' })
  async findExpoById(@Param('expoId', ParseIntPipe) expoId: number) {
    return this.expoService.findExpoById(expoId);
  }

  @Public()
  @Get(':id/booths')
  @ApiOperation({description: 'Get all booths of an expo'})
  async findAllBoothsByExpoId(@Param('expoId', ParseIntPipe) expoId: number) {
    return this.expoService.findAllBoothByExpoId(expoId);
  }
}
