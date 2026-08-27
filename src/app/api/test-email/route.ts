import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { env } from '@/config/env';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetEmail = searchParams.get('to') || process.env.SMTP_USER || env.SMTP_USER;

  const smtpUser = process.env.SMTP_USER || env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || String(env.SMTP_PORT || 587), 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({
      success: false,
      error: 'SMTP credentials missing',
      details: { smtpUser: Boolean(smtpUser), smtpPass: Boolean(smtpPass) },
    }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  try {
    const verifyResult = await transporter.verify();
    console.log('[TestEmail] SMTP Verify:', verifyResult);

    const sendResult = await transporter.sendMail({
      from: `"GCC Diagnostic Test" <${smtpUser}>`,
      to: targetEmail,
      subject: 'Vercel SMTP Test Email',
      text: 'This is a test email sent from Vercel serverless function to diagnose SMTP delivery.',
    });

    return NextResponse.json({
      success: true,
      verifyResult,
      sendResult,
      config: { smtpHost, smtpPort, smtpSecure, smtpUserMasked: `${smtpUser.substring(0, 4)}***` },
    });
  } catch (error) {
    console.error('[TestEmail Error]:', error);
    return NextResponse.json({
      success: false,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      config: { smtpHost, smtpPort, smtpSecure, smtpUserMasked: `${smtpUser.substring(0, 4)}***` },
    }, { status: 500 });
  }
}
