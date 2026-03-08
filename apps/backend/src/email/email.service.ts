import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

export interface SendEmailDTO {
  recipients: string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private emailTransport() {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    this.logger.debug(`SMTP config → host:${host} port:${port} user:${user}`);

    if (!host || !user || !pass) {
      throw new Error('EMAIL_HOST / EMAIL_USER / EMAIL_PASSWORD are not set in .env');
    }

    const smtpConfig: SMTPTransport.Options = {
      host,
      port: Number(port) || 587,
      secure: false,
      auth: { user, pass },
    };

    return nodemailer.createTransport(smtpConfig);
  }

  async sendEmail(dto: SendEmailDTO): Promise<void> {
    const { recipients, subject, html } = dto;
    const from = this.configService.get<string>('EMAIL_USER');
    const transporter = this.emailTransport();

    await transporter.sendMail({ from, to: recipients, subject, html });
    this.logger.log(`Email sent to ${recipients.join(', ')}`);
  }

  async sendBoothRejectionEmail(dto: {
    companyEmail: string;
    companyName: string;
    boothName: string;
    expoName: string;
    rejectionReason?: string;
  }): Promise<void> {
    const templatePath = path.join(__dirname, 'templates', 'booth-rejected.hbs');
    const source = fs.readFileSync(templatePath, 'utf-8');
    const html = Handlebars.compile(source)(dto);

    await this.sendEmail({
      recipients: [dto.companyEmail],
      subject: `Your booth "${dto.boothName}" was not approved`,
      html,
    });
  }
}