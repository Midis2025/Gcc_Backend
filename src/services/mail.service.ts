import { Resend } from 'resend';
import { env } from '@/config/env';
import {
  EmailData,
  marketLabel,
  generateInvestorAdminEmail,
  generateCompanyAdminEmail,
  generateCompanyConfirmationEmail,
  generateInvestorConfirmationEmail,
  generateConfirmationText,
  generateAdminText,
} from '@/templates/email-templates';

type SendResult = { data: unknown; error: unknown };

export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  private getAdminEmail(): string {
    return (
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      env.CONTACT_NOTIFICATION_EMAIL ||
      'info@gulfconnectconsultancy.com'
    );
  }

  private getSenderEmail(): string {
    return process.env.RESEND_SENDER_EMAIL || 'info@gulfconnectconsultancy.com';
  }

  private getCalendlyLink(data: { name: string; email: string }): string {
    const baseUrl =
      process.env.CALENDLY_URL ||
      env.CALENDLY_URL ||
      'https://calendly.com/gulfconnectconsultancy-info/30min';
    return `${baseUrl}?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`;
  }

  private log(label: string, res: SendResult): void {
    if (res.error) {
      console.error(`[MailService] ${label} failed:`, res.error);
    } else {
      console.log(`[MailService] ${label} sent:`, res.data);
    }
  }

  /** Rows shared by the admin HTML table and its plain-text alternative. */
  private investorRows(data: EmailData): Array<[string, string]> {
    return [
      ['Name:', data.name || ''],
      ['Email:', data.email || ''],
      ['Phone:', data.phone || ''],
      ['Company/Fund:', data.company || ''],
      ['Job Title:', data.jobTitle || ''],
      ['Location:', data.location || marketLabel(data.market)],
      ['Investor Type:', data.investorType || data.area || ''],
      ['Investment Interests:', data.investmentInterests || data.message || ''],
    ];
  }

  private companyRows(data: EmailData): Array<[string, string]> {
    return [
      ['Name:', data.name || ''],
      ['Email:', data.email || ''],
      ['Phone:', data.phone || ''],
      ['Company:', data.company || ''],
      ['Market:', data.location || marketLabel(data.market)],
      ['Area of Interest:', data.area || ''],
      ['Message / Details:', data.message || ''],
    ];
  }

  /**
   * Investor registration: confirmation to the investor, alert to the desk.
   * The admin mail follows 'GCC Mail Template Investor Registration — Admin.pdf'.
   */
  async sendInvestorEmails(data: EmailData): Promise<void> {
    const adminEmail = this.getAdminEmail();
    const senderEmail = this.getSenderEmail();
    const meetingLink = this.getCalendlyLink(data);

    try {
      console.log(`[MailService] Sending investor registration emails for ${data.email}...`);

      const [userRes, adminRes] = await Promise.all([
        this.resend.emails.send({
          from: `Gulf Connect Consultancy <${senderEmail}>`,
          to: data.email,
          subject: 'Thank You for Contacting Gulf Connect',
          html: generateInvestorConfirmationEmail(data, meetingLink),
          text: generateConfirmationText(data, meetingLink, true),
        }),
        this.resend.emails.send({
          from: `Gulf Connect Alert <${senderEmail}>`,
          to: adminEmail,
          replyTo: data.email,
          subject: `New Investor Registration: ${data.name}${data.company ? ` (${data.company})` : ''}`,
          html: generateInvestorAdminEmail(data),
          text: generateAdminText('New Investor Registration', this.investorRows(data)),
        }),
      ]);

      this.log('Investor confirmation', userRes as SendResult);
      this.log('Investor admin alert', adminRes as SendResult);
    } catch (error) {
      console.error('[MailService] Failed to send investor emails:', error);
    }
  }

  /**
   * Company registration: confirmation to the client, alert to the desk.
   * The client mail follows
   * 'GCC Mail Template Company Registration — Confirmation Email.pdf'.
   */
  async sendCompanyEmails(data: EmailData): Promise<void> {
    const adminEmail = this.getAdminEmail();
    const senderEmail = this.getSenderEmail();
    const meetingLink = this.getCalendlyLink(data);

    try {
      console.log(`[MailService] Sending company registration emails for ${data.email}...`);

      const [userRes, adminRes] = await Promise.all([
        this.resend.emails.send({
          from: `Gulf Connect Consultancy <${senderEmail}>`,
          to: data.email,
          subject: 'Thank You for Contacting Gulf Connect',
          html: generateCompanyConfirmationEmail(data, meetingLink),
          text: generateConfirmationText(data, meetingLink, false),
        }),
        this.resend.emails.send({
          from: `Gulf Connect Alert <${senderEmail}>`,
          to: adminEmail,
          replyTo: data.email,
          subject: `New Company Registration: ${data.name}${data.company ? ` (${data.company})` : ''}`,
          html: generateCompanyAdminEmail(data),
          text: generateAdminText('New Company Registration', this.companyRows(data)),
        }),
      ]);

      this.log('Company confirmation', userRes as SendResult);
      this.log('Company admin alert', adminRes as SendResult);
    } catch (error) {
      console.error('[MailService] Failed to send company emails:', error);
    }
  }

  /**
   * Backwards-compatible meeting email sender.
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
    const payload: EmailData = {
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
    };

    return data.area.toLowerCase().includes('investor')
      ? this.sendInvestorEmails(payload)
      : this.sendCompanyEmails(payload);
  }
}

export const mailService = new MailService();
