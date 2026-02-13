import {
  BadRequestException,
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
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UserAdminController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ description: 'Get all the users.' })
  @ApiOkResponse({ description: 'A list of users' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.userService.findAllPaginated(page, limit);
  }

  @ApiOperation({ description: 'Get the user based on their id.' })
  @ApiOkResponse({ description: 'The specific user' })
  @Get(':id')
  findUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.findOneById(userId);
  }

  @ApiOperation({ description: "Edit the user's role." })
  @Patch(':id/role')
  editUserRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRoleDTO) {
    return this.userService.setRole(userId, dto.role);
  }

  @ApiOperation({ description: 'Delete the user.' })
  @ApiBadRequestResponse({ description: 'Admins cannot delete themselves' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseIntPipe) userId: number, @Req() req) {
    if (req.user.id === userId) {
      throw new BadRequestException('Admins cannot delete themselves');
    }
    return this.userService.deleteUser(userId);
  }
}
