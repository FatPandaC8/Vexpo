import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SystemService } from './system.service';

@ApiTags('Admin - System')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class SystemAdminController {
  constructor(private systemService: SystemService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get system logs' })
  async getLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('action') action?: string,
    @Query('userId') userId?: number
  ) {
    return this.systemService.getLogs({ page, limit, action, userId });
  }
}