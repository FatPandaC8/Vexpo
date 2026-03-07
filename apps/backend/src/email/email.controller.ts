import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDTO } from './dto/email.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) {}

    @Post('send')
    async sendMail(@Body() dto: sendEmailDTO) {
        await this.emailService.sendEmail(dto);
        return {message: 'Email send successfully'}; 
    }
}
