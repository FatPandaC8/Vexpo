import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { BoothsService } from './booths.service';
import { UpdateBoothDTO } from './dto/update-booth.dto';

@ApiTags('Booths')
@Controller('booths')
export class BoothsController {
  constructor(private boothsService: BoothsService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get booth details by ID' })
  async getBoothById(@Param('id', ParseIntPipe) boothId: number) {
    return this.boothsService.getBoothById(boothId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get booth details by ID' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.boothsService.findAllPaginated(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER', 'EXHIBITOR', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update booth content (exhibitor/admin only)' })
  async updateBooth(
    @Param('id', ParseIntPipe) boothId: number,
    @Body() dto: UpdateBoothDTO,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const role   = req.user.role;

    if (role === 'ADMIN' || role === 'ORGANIZER') {
      return this.boothsService.updateBooth(boothId, dto);
    }
    return this.boothsService.updateBoothByExhibitor(boothId, userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER', 'EXHIBITOR', 'ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booth (exhibitor/admin only)' })
  async deleteBooth(
    @Param('id', ParseIntPipe) boothId: number,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const role   = req.user.role;

    if (role === 'ADMIN') {
      return this.boothsService.deleteBooth(boothId);
    }
    return this.boothsService.deleteBoothByExhibitor(boothId, userId);
  }
}