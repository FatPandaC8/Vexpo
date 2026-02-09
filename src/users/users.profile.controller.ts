import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('me')
export class UsersProfileController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Req() req) {
    return this.userService.profile(req.user.userId);
    // console.log("The current user id is: ", req.user.userId);
  }
}
