import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users - Profile')
@Controller('me')
@UseGuards(JwtAuthGuard)
export class UsersProfileController {
  constructor(private userService: UsersService) {}

  @Get()
  async getMyProfile(@Req() req) {
    const user = await this.userService.findOneById(req.user.userId);
    if (!user) return null;

    return {
      id:    user.id,
      name:  user.name,
      email: user.email,
      roles: user.roles?.map((ur) => ur.role.name.toUpperCase()) ?? [],
    };
  }

  @Patch('change')
  editMyProfile() {
    // TODO: think about password reset as well ?
    // Send the request by email
  }
}
