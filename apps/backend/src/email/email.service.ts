import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { sendEmailDTO } from './dto/email.dto';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

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
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    return transporter;
  }

  // Testing sending email
  async sendEmail(dto: sendEmailDTO) {
    const { recipients, subject, html } = dto;

    const transporter = this.emailTransport();

    const option: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject: subject,
      html: html,
    };

    try {
      await transporter.sendMail(option);
      console.log('Email send successfully');
    } catch (error) {
      console.log('Error sending email', error);
    }
  }

  async sendBoothRejectionEmail(dto: {
    companyEmail: string;
    companyName: string;
    boothName: string;
    expoName: string;
    rejectionReason?: string;
    }) {
    const templatePath = path.join(
        __dirname,
        'templates',
        'booth-rejected.hbs',
    );
    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(source);
    const html = template(dto);

    await this.sendEmail({
        recipients: [dto.companyEmail],
        subject: `Your booth "${dto.boothName}" was not approved`,
        html,
    });
    }
}
