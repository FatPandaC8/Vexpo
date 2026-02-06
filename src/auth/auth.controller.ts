import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { GoogleOAuthGuard } from './google-auth.guard';
import { OAuthCompleteDTO } from './dto/oauthcomplete.dto';
import express from 'express';
// endpoints which serve sensitive data must be protected by

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // redirect to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: express.Response ) {
    const result = await this.authService.oauthLogin(req.user);

    if (result.is_new_user) {
      // New user - needs to select role
      return res.json({
        message: 'New user detected. Please complete registration by selecting a role.',
        access_token: result.access_token,
        is_new_user: true,
        next_step: 'POST /auth/oauth/complete with role selection',
      });
    } else {
      // Existing user - return full access token
      return res.json({
        message: 'Authentication successful',
        access_token: result.access_token,
        is_new_user: false,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('oauth/complete')
  async completeOAuthRegistration(
    @Request() req,
    @Body() dto: OAuthCompleteDTO,
  ) {
    const userId = req.user.userId;
    return this.authService.completeOAuthRegistration(userId, dto.role);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return req.user;
  }
}
