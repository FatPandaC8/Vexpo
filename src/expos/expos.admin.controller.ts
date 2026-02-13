import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExposService } from './expos.service';
import { UpdateExpoDTO } from './dto/update-expo.dto';

@ApiTags('Admin - Expos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/expos')
export class ExposAdminController {
  constructor(private exposService: ExposService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get expo by ID (admin)' })
  async getExpo(@Param('id', ParseIntPipe) id: number) {
    return this.exposService.findExpoById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expo (admin)' })
  async updateExpo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpoDTO
  ) {
    // return this.exposService.updateExpo(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expo (admin)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExpo(@Param('id', ParseIntPipe) id: number) {
    // return this.exposService.deleteExpo(id);
  }
}