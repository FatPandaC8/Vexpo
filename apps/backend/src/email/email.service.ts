import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { sendEmailDTO } from './dto/email.dto';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}

    
    emailTransport() {
        const smtpConfig: SMTPTransport.Options = {
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD')
            }
        };

        const transporter = nodemailer.createTransport( smtpConfig );

        return transporter;
    }

    async sendEmail(dto: sendEmailDTO) {
        const {recipients, subject, html} = dto;

        const transporter = this.emailTransport();

        const option: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: recipients,
            subject: subject,
            html: html
        };

        try {
            await transporter.sendMail(option);
            console.log('Email send successfully');

        } catch (error) {
            console.log("Error sending email", error)
        }
    }
}
