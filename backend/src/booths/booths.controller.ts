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
  @ApiOperation({ summary: 'Get all booths (paginated)' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.boothsService.findAllPaginated(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'exhibitor', 'admin', 'ORGANIZER', 'EXHIBITOR', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update booth' })
  async updateBooth(
    @Param('id', ParseIntPipe) boothId: number,
    @Body() dto: UpdateBoothDTO,
    @Req() req: any,
  ) {
    const roles: string[] = (req.user.roles ?? []).map((r: string) => r.toLowerCase());
    const userId: number = req.user.userId;

    if (roles.includes('admin') || roles.includes('organizer')) {
      return this.boothsService.updateBooth(boothId, dto);
    }
    return this.boothsService.updateBoothByExhibitor(boothId, userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'exhibitor', 'admin', 'ORGANIZER', 'EXHIBITOR', 'ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booth' })
  async deleteBooth(
    @Param('id', ParseIntPipe) boothId: number,
    @Req() req: any,
  ) {
    const roles: string[] = (req.user.roles ?? []).map((r: string) => r.toLowerCase());
    const userId: number = req.user.userId;

    if (roles.includes('admin') || roles.includes('organizer')) {
      return this.boothsService.deleteBooth(boothId);
    }
    return this.boothsService.deleteBoothByExhibitor(boothId, userId);
  }
}