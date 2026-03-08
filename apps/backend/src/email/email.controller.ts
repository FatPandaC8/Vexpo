import { Body, Controller, Post } from '@nestjs/common';
import * as emailService from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: emailService.EmailService) {}

  @Post('send')
  async sendMail(@Body() dto: emailService.SendEmailDTO) {
    await this.emailService.sendEmail(dto);
    return { message: 'Email sent successfully' };
  }
}