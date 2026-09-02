import { Resend } from 'resend';
import { env } from '@/config/env';
import {
  EmailData,
  generateInvestorAdminEmail,
  generateCompanyConfirmationEmail,
  generateCompanyAdminEmail,
} from '@/templates/email-templates';

export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  private getAdminEmail(): string {
    return process.env.CONTACT_NOTIFICATION_EMAIL || env.CONTACT_NOTIFICATION_EMAIL || 'info@gulfconnectconsultancy.com';
  }

  private getSenderEmail(): string {
    return process.env.RESEND_SENDER_EMAIL || 'info@gulfconnectconsultancy.com';
  }

  private getCalendlyLink(data: { name: string; email: string }): string {
    const baseUrl = process.env.CALENDLY_URL || env.CALENDLY_URL || 'https://calendly.com/gulfconnectconsultancy-info/30min';
    return `${baseUrl}?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`;
  }

  /**
   * Sends emails for Investor Registration (PDF Template 1 for Admin, PDF Template 2 for Investor)
   */
  async sendInvestorEmails(data: EmailData): Promise<void> {
    const adminEmail = this.getAdminEmail();
    const senderEmail = this.getSenderEmail();
    const calendlyLink = this.getCalendlyLink(data);

    try {
      console.log(`[MailService] Sending Investor Registration emails for: ${data.email}...`);

      const userMailHtml = generateCompanyConfirmationEmail(data, calendlyLink);
      const adminMailHtml = generateInvestorAdminEmail(data);

      const userMailPromise = this.resend.emails.send({
        from: `Gulf Connect Consultancy <${senderEmail}>`,
        to: data.email,
        subject: 'Thank You for Contacting Gulf Connect',
        html: userMailHtml,
      });

      const adminMailPromise = this.resend.emails.send({
        from: `Gulf Connect Alert <${senderEmail}>`,
        to: adminEmail,
        subject: `New Investor Registration: ${data.name} (${data.company})`,
        html: adminMailHtml,
      });

      const [userRes, adminRes] = await Promise.all([userMailPromise, adminMailPromise]);

      if (userRes.error) {
        console.error('[MailService] Resend Investor User Email Error:', userRes.error);
      } else {
        console.log('[MailService] Investor User email sent via Resend:', userRes.data);
      }

      if (adminRes.error) {
        console.error('[MailService] Resend Investor Admin Email Error:', adminRes.error);
      } else {
        console.log('[MailService] Investor Admin email sent via Resend:', adminRes.data);
      }
    } catch (error) {
      console.error('[MailService] Failed to send Investor emails:', error);
    }
  }

  /**
   * Sends emails for Company Registration (PDF Template 2 for Client, Admin Alert for Admin)
   */
  async sendCompanyEmails(data: EmailData): Promise<void> {
    const adminEmail = this.getAdminEmail();
    const senderEmail = this.getSenderEmail();
    const calendlyLink = this.getCalendlyLink(data);

    try {
      console.log(`[MailService] Sending Company Registration emails for: ${data.email}...`);

      const userMailHtml = generateCompanyConfirmationEmail(data, calendlyLink);
      const adminMailHtml = generateCompanyAdminEmail(data);

      const userMailPromise = this.resend.emails.send({
        from: `Gulf Connect Consultancy <${senderEmail}>`,
        to: data.email,
        subject: 'Thank You for Contacting Gulf Connect',
        html: userMailHtml,
      });

      const adminMailPromise = this.resend.emails.send({
        from: `Gulf Connect Alert <${senderEmail}>`,
        to: adminEmail,
        subject: `🔔 New Company Registration: ${data.name} (${data.company})`,
        html: adminMailHtml,
      });

      const [userRes, adminRes] = await Promise.all([userMailPromise, adminMailPromise]);

      if (userRes.error) {
        console.error('[MailService] Resend Company User Email Error:', userRes.error);
      } else {
        console.log('[MailService] Company User email sent via Resend:', userRes.data);
      }

      if (adminRes.error) {
        console.error('[MailService] Resend Company Admin Email Error:', adminRes.error);
      } else {
        console.log('[MailService] Company Admin email sent via Resend:', adminRes.data);
      }
    } catch (error) {
      console.error('[MailService] Failed to send Company emails:', error);
    }
  }

  /**
   * Backwards-compatible meeting email sender
   */
  async sendMeetingEmails(data: {
    name: string;
    email: string;
    company: string;
    phone?: string;
    market?: string;
    preferredDate?: string;
    preferredTime?: string;
    enquiryId: string;
    area: string;
    message: string;
  }): Promise<void> {
    const isInvestor = data.area.toLowerCase().includes('investor');

    if (isInvestor) {
      return this.sendInvestorEmails({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        market: data.market,
        area: data.area,
        message: data.message,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        enquiryId: data.enquiryId,
      });
    }

    return this.sendCompanyEmails({
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      market: data.market,
      area: data.area,
      message: data.message,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      enquiryId: data.enquiryId,
    });
  }
}

export const mailService = new MailService();

