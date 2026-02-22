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
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BoothsService } from './booths.service';
import { UpdateBoothDTO } from './dto/update-booth.dto';

@ApiTags('Admin - Booths')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/booths')
export class BoothsAdminController {
  constructor(private boothsService: BoothsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all booths (paginated)' })
  async getAllBooths(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.boothsService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booth by ID' })
  async getBooth(@Param('id', ParseIntPipe) id: number) {
    return this.boothsService.getBoothById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booth content' })
  async updateBooth(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBoothDTO,
  ) {
    return this.boothsService.updateBooth(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booth' })
  async deleteBooth(@Param('id', ParseIntPipe) id: number) {
    return this.boothsService.deleteBooth(id);
  }
}