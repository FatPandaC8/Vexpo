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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDTO } from './dto/register.dto';
import { GoogleOAuthGuard } from './google-auth.guard';
import { OAuthCompleteDTO } from './dto/oauthcomplete.dto';
import express from 'express';
// endpoints which serve sensitive data must be protected by

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Redirect to google for authentication.' })
  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // redirect to Google
  }

  @ApiOperation({ description: 'Call back for Google to continue signing in.' })
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: express.Response) {
    const result = await this.authService.oauthLogin(req.user);

    if (result.is_new_user) {
      // New user - needs to select role
      return res.redirect(
        `http://localhost:3001/auth/select-role?token=${result.access_token}`,
      );
    }

    return res.redirect(
      `http://localhost:3001/auth/success?token=${result.access_token}`,
    );
  }

  @ApiOperation({
    description:
      'After successfully sign in with google accounts, redirect to this to choose a role.',
  })
  @ApiOkResponse({ description: 'Return access token' })
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

  @ApiOperation({ description: 'Register a new user.' })
  @ApiOkResponse({
    description: 'Register successfully and return access token',
  })
  @ApiBadRequestResponse({ description: 'This email has been registered' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @ApiOperation({ description: 'Login into an user.' })
  @ApiOkResponse({ description: 'Return access token' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @ApiOperation({ description: 'Log out of current user.' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
