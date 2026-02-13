import { 
  Controller, 
  Post, 
  Get,
  Patch,
  Param, 
  Body,
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoothsService } from 'src/booths/booths.service';
import { CreateBoothContentDTO } from 'src/booths/dto/create-booth-content.dto';
import { UpdateBoothContentDTO } from 'src/booths/dto/update-booth.dto';

@ApiTags('Exhibitor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EXHIBITOR')
@Controller()
export class UserExhibitorController {
  constructor(private boothsService: BoothsService) {}

  @Post('expos/:expoId/booths')
  @ApiOperation({ summary: 'Register booth for an expo' })
  async registerBooth(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Body() dto: CreateBoothContentDTO,
    @Request() req
  ) {
    return this.boothsService.createBooth(expoId, req.user.userId, dto);
  }

  @Get('me/booths')
  @ApiOperation({ summary: 'Get all booths of current exhibitor' })
  async getMyBooths(@Request() req) {
    return this.boothsService.getBoothsByExhibitor(req.user.userId);
  }

  @Patch('booths/:boothId')
  @ApiOperation({ summary: 'Update booth information' })
  async updateBooth(
    @Param('boothId', ParseIntPipe) boothId: number,
    @Body() dto: UpdateBoothContentDTO,
    @Request() req
  ) {
    return this.boothsService.updateBoothByExhibitor(
      boothId, 
      req.user.userId, 
      dto
    );
  }

//   @Get('me/exhibitor-stats')
//   @ApiOperation({ summary: 'Get exhibitor statistics' })
//   async getExhibitorStats(@Request() req) {
//     return this.boothsService.getExhibitorStats(req.user.userId);
//   }
}