import nodemailer, { Transporter } from 'nodemailer';
import { MAIL_FROM } from '../site-config';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;
  private readonly mailFromName: string;

  private constructor() {
    this.mailFromName = MAIL_FROM;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT!),
      secure: parseInt(process.env.SMTP_PORT!) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { to, subject, html, attachments } = options;
      
      await this.transporter.sendMail({
        from: `${this.mailFromName} <${process.env.SMTP_USER}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  public async sendMultipleEmails(emailsOptions: EmailOptions[]): Promise<void> {
    try {
      await Promise.all(
        emailsOptions.map(options => this.sendEmail(options))
      );
    } catch (error) {
      console.error('Error sending multiple emails:', error);
      throw new Error('Failed to send multiple emails');
    }
  }
}