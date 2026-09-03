export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL || '',
  CALENDLY_URL: process.env.CALENDLY_URL || 'https://calendly.com/gulfconnectconsultancy-info/30min',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_SENDER_EMAIL: process.env.RESEND_SENDER_EMAIL || 'info@gulfconnectconsultancy.com',
  /** Public origin the e-mail templates prefix onto /email/gcc-logo.png. */
  EMAIL_ASSET_BASE_URL: process.env.EMAIL_ASSET_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || '',
  /** Overrides the derived logo URL outright (e.g. a CDN copy). */
  EMAIL_LOGO_URL: process.env.EMAIL_LOGO_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'gcc-dev-jwt-secret',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
