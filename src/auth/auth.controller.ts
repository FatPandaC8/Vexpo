import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from './jwt-auth.guard';
// endpoints which serve sensitive data must be protected by

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register() {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return req.user;
  }
}
