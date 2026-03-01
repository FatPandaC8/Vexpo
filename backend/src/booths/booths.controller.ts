import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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

  // ── Public ────────────────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all booths (paginated)' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.boothsService.findAllPaginated(page, limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get booth by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boothsService.getBoothById(id);
  }

  // ── Authenticated — exhibitor owns, organizer/admin bypass ────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('exhibitor', 'organizer')
  @Patch(':id')
  @ApiOperation({ summary: 'Update booth' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBoothDTO,
    @Req() req: any,
  ) {
    const roles: string[] = req.user.roles.map((r: string) => r.toLowerCase());
    const userId: string = req.user.userId;

    if (roles.includes('admin') || roles.includes('organizer')) {
      return this.boothsService.updateBooth(id, dto);
    }

    // Exhibitor: strip status - cannot self-approve
    const { status, ...exhibitorDto } = dto;
    return this.boothsService.updateBoothByExhibitor(id, userId, exhibitorDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('exhibitor', 'organizer')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booth' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const roles: string[] = req.user.roles.map((r: string) => r.toLowerCase());
    const userId: string = req.user.userId;

    if (roles.includes('admin') || roles.includes('organizer')) {
      return this.boothsService.deleteBooth(id);
    }
    return this.boothsService.deleteBoothByExhibitor(id, userId);
  }
}
