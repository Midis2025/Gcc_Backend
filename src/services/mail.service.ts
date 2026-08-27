import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '@/config/env';

export class MailService {
  async sendMeetingEmails(data: {
    name: string;
    email: string;
    company: string;
    preferredDate?: string;
    preferredTime?: string;
    enquiryId: string;
    area: string;
    message: string;
  }): Promise<void> {
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER || env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS || env.SMTP_PASS;
    const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL || env.CONTACT_NOTIFICATION_EMAIL || smtpUser;

    const meetingLink = `https://meet.jit.si/GCC-Consultation-${data.enquiryId}`;

    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #0c141d; border-bottom: 2px solid #c8a670; padding-bottom: 10px;">Meeting Confirmation</h2>
        <p>Hi <strong>${data.name}</strong>,</p>
        <p>Thank you for reaching out to Gulf Connect Consultancy. We have received your enquiry for <strong>${data.company}</strong>.</p>
        
        <div style="background: #f4f6f8; padding: 15px; border-left: 4px solid #c8a670; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Requested Date:</strong> ${data.preferredDate || 'To be scheduled'}</p>
          <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${data.preferredTime || 'To be scheduled'}</p>
          <p style="margin: 5px 0;"><strong>Area of Interest:</strong> ${data.area}</p>
        </div>

        <p>You can join the video consultation at your scheduled time using the link below:</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="${meetingLink}" style="background-color: #c8a670; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            👉 Join Video Meeting
          </a>
        </p>
        
        <p style="font-size: 13px; color: #666;">Meeting Link: <a href="${meetingLink}" style="color: #c8a670;">${meetingLink}</a></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 12px; color: #888;">© 2026 Gulf Connect Consultancy. All rights reserved.</p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h2 style="color: #0c141d; border-bottom: 2px solid #c8a670; padding-bottom: 10px;">New Contact Enquiry & Meeting Request</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 6px; font-weight: bold;">Client Name:</td><td style="padding: 6px;">${data.name}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Company:</td><td style="padding: 6px;">${data.company}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Work Email:</td><td style="padding: 6px;">${data.email}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Requested Date:</td><td style="padding: 6px;">${data.preferredDate || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Requested Time:</td><td style="padding: 6px;">${data.preferredTime || 'N/A'}</td></tr>
          <tr><td style="padding: 6px; font-weight: bold;">Area:</td><td style="padding: 6px;">${data.area}</td></tr>
        </table>

        <div style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd; margin: 20px 0;">
          <strong>Message Outline:</strong>
          <p>${data.message}</p>
        </div>

        <p style="font-weight: bold;">Join the client at the scheduled time using this link:</p>
        <p><a href="${meetingLink}" style="color: #c8a670; font-size: 16px; font-weight: bold;">${meetingLink}</a></p>
      </div>
    `;

    // 1. Resend API (Recommended for Vercel cloud serverless production)
    if (resendApiKey) {
      try {
        console.log(`[MailService] Sending email via Resend API for enquiry ${data.enquiryId}...`);
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Gulf Connect <onboarding@resend.dev>';
        
        await Promise.all([
          resend.emails.send({
            from: fromEmail,
            to: data.email,
            subject: 'Meeting Confirmation - Gulf Connect Consultancy',
            html: userHtml,
          }),
          resend.emails.send({
            from: fromEmail,
            to: adminEmail || 'onboarding@resend.dev',
            subject: `🔔 New Meeting Request: ${data.name} (${data.company})`,
            html: adminHtml,
          }),
        ]);
        console.log(`[MailService] Resend email sent successfully for enquiry ${data.enquiryId}`);
        return;
      } catch (resendError) {
        console.error('[MailService] Resend API failed, falling back to Nodemailer SMTP:', resendError);
      }
    }

    // 2. Nodemailer SMTP Fallback
    if (!smtpUser || !smtpPass) {
      console.warn('[MailService] No email provider configured (missing RESEND_API_KEY and SMTP credentials).');
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || String(env.SMTP_PORT || 587), 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      const userMailPromise = transporter.sendMail({
        from: `"Gulf Connect Consultancy" <${smtpUser}>`,
        to: data.email,
        subject: 'Meeting Confirmation - Gulf Connect Consultancy',
        html: userHtml,
      });

      const adminMailPromise = transporter.sendMail({
        from: `"GCC System Alert" <${smtpUser}>`,
        to: adminEmail,
        subject: `🔔 New Meeting Request: ${data.name} (${data.company})`,
        html: adminHtml,
      });

      await Promise.all([userMailPromise, adminMailPromise]);
      console.log(`[MailService] Nodemailer emails sent successfully for enquiry ${data.enquiryId}`);
    } catch (error) {
      console.error('[MailService] Failed to send Nodemailer emails:', error);
      throw error;
    }
  }
}

export const mailService = new MailService();
