import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@ApiTags('Admin - Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reports')
export class ReportsAdminController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async getAllReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string
  ) {
    return this.reportsService.findAll({ page, limit, status });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update report status' })
  async updateReportStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReportStatusDto
  ) {
    return this.reportsService.updateStatus(id, dto.status);
  }
}