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
  getMyProfile(@Req() req) {
    return this.userService.profile(req.user.userId);
    // console.log("The current user id is: ", req.user.userId);
  }

  @Patch('change')
  editMyProfile() {
    // TODO: think about password reset as well ?
    // Send the request by email
  }
}
