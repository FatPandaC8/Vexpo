// src/booths/booths.admin.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BoothsService } from './booths.service';
import { UpdateBoothContentDTO } from './dto/update-booth.dto';

@ApiTags('Admin - Booths')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/booths')
export class BoothsAdminController {
  constructor(private boothsService: BoothsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all booths' })
  async getAllBooths(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.boothsService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booth by ID ' })
  async getBooth(@Param('id', ParseIntPipe) id: number) {
    return this.boothsService.getBoothById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booth' })
  async updateBooth(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBoothContentDTO
  ) {
    return this.boothsService.updateBooth(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booth' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooth(@Param('id', ParseIntPipe) id: number) {
    return this.boothsService.deleteBooth(id);
  }
}