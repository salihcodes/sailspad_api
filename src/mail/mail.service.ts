import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import { confirmMail } from './templates/confirm-mail.html';
import { forgotPasswordMail } from './templates/forgot-password.html';
import { newSubscriptionMail } from './templates/new-subscription.html';
import { subscriptionCancellationMail } from './templates/subscription-cancellation.html';
import { subscriptionUpdateMail } from './templates/subscription-update.html';
@Injectable()
export class MailService {
  private transporter: Mail;
  private socials: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.password'),
      },
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
    });
    this.socials = this.configService
      .get('mail.socials')
      .map(
        (social) =>
          `<a href="${social[1]}" style="box-sizing:border-box;color: green;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">${social[0]}</a>`,
      )
      .join('');
  }

  async sendOtpEmail(
    name: string,
    email: string,
    otp: string,
  ): Promise<boolean> {
    const mail = confirmMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      //   .replace(new RegExp('--CompanyName--', 'g'), config.project.company)
      //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
      //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
      //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
      //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
      //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
      //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
      //   .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--email--', 'g'), email)
      .replace(new RegExp('--Otp--', 'g'), otp);
    //   .replace(
    //     new RegExp('--TermsOfServiceLink--', 'g'),
    //     config.project.termsOfServiceUrl,
    //   );

    const mailOptions = {
      from: `"${this.configService.get(
        'mail.defaultName',
      )}" <${this.configService.get('mail.defaultEmail')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Welcome to Sailspad ${name}`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.error(
            'Mail sending failed, check your service credentials.',
            error,
          );
          console.log(error);
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendForgotPasswordEmail(
    name: string,
    email: string,
    resetLink: string,
  ): Promise<boolean> {
    const mail = forgotPasswordMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      //   .replace(new RegExp('--CompanyName--', 'g'), config.project.company)
      //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
      //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
      //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
      //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
      //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
      //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
      //   .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--email--', 'g'), email)
      .replace(new RegExp('--resetLink--', 'g'), resetLink);
    //   .replace(
    //     new RegExp('--TermsOfServiceLink--', 'g'),
    //     config.project.termsOfServiceUrl,
    //   );

    const mailOptions = {
      from: `"${this.configService.get(
        'mail.defaultName',
      )}" <${this.configService.get('mail.defaultEmail')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Password Reset Request for ${name}`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.error(
            'Mail sending failed, check your service credentials.',
            error,
          );
          console.log(error);
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendNewSubscriptionEmail(
    name: string,
    email: string,
    amountPaid: string,
    quantity: string,
    nextBillDate: string,
    invoiceLink: string,
  ): Promise<boolean> {
    const mail = newSubscriptionMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      //   .replace(new RegExp('--CompanyName--', 'g'), config.project.company)
      //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
      //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
      //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
      //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
      //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
      //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--email--', 'g'), email)
      .replace(new RegExp('--AmountPaid--', 'g'), amountPaid)
      .replace(new RegExp('--Quantity--', 'g'), quantity)
      .replace(new RegExp('--NextBillDate--', 'g'), nextBillDate)
      .replace(new RegExp('--InvoiceLink--', 'g'), invoiceLink);
    //   .replace(
    //     new RegExp('--TermsOfServiceLink--', 'g'),
    //     config.project.termsOfServiceUrl,
    //   );

    const mailOptions = {
      from: `"${this.configService.get(
        'mail.defaultName',
      )}" <${this.configService.get('mail.defaultEmail')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Sailspad subscription successful`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendSubscriptionUpdateEmail(
    name: string,
    email: string,
    amountPaid: string,
    quantity: string,
    nextBillDate: string,
    invoiceLink: string,
  ): Promise<boolean> {
    const mail = subscriptionUpdateMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      //   .replace(new RegExp('--CompanyName--', 'g'), config.project.company)
      //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
      //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
      //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
      //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
      //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
      //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--email--', 'g'), email)
      .replace(new RegExp('--AmountPaid--', 'g'), amountPaid)
      .replace(new RegExp('--Quantity--', 'g'), quantity)
      .replace(new RegExp('--NextBillDate--', 'g'), nextBillDate)
      .replace(new RegExp('--InvoiceLink--', 'g'), invoiceLink);
    //   .replace(
    //     new RegExp('--TermsOfServiceLink--', 'g'),
    //     config.project.termsOfServiceUrl,
    //   );

    const mailOptions = {
      from: `"${this.configService.get(
        'mail.defaultName',
      )}" <${this.configService.get('mail.defaultEmail')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Sailspad subscription upgraded`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }

  async sendSubscriptionCancellationEmail(
    name: string,
    email: string,
  ): Promise<boolean> {
    const mail = subscriptionCancellationMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      //   .replace(new RegExp('--CompanyName--', 'g'), config.project.company)
      //   .replace(new RegExp('--ProjectName--', 'g'), config.project.name)
      //   .replace(new RegExp('--ProjectAddress--', 'g'), config.project.address)
      //   .replace(new RegExp('--ProjectLogo--', 'g'), config.project.logoUrl)
      //   .replace(new RegExp('--ProjectSlogan--', 'g'), config.project.slogan)
      //   .replace(new RegExp('--ProjectColor--', 'g'), config.project.color)
      //   .replace(new RegExp('--ProjectLink--', 'g'), config.project.url)
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--email--', 'g'), email);
    //   .replace(
    //     new RegExp('--TermsOfServiceLink--', 'g'),
    //     config.project.termsOfServiceUrl,
    //   );

    const mailOptions = {
      from: `"${this.configService.get(
        'mail.defaultName',
      )}" <${this.configService.get('mail.defaultEmail')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Sailspad subscription cancelled`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.',
          );
          resolve(false);
        }
        resolve(true);
      }),
    );
  }
}
