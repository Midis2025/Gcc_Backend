import { db } from '@/config/db';
import { ApiResponse } from '@/utils/api-response';

export async function GET() {
  let dbStatus = 'DISCONNECTED';
  try {
    await db.connect();
    dbStatus = 'CONNECTED';
  } catch (error) {
    dbStatus = 'ERROR';
    console.error('Health check DB connection error:', error);
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpConfigured = Boolean(smtpUser && smtpPass);

  return ApiResponse.success(
    {
      status: 'UP',
      database: dbStatus,
      smtpConfigured,
      smtpUser: smtpUser ? `${smtpUser.substring(0, 4)}***` : 'NOT_SET',
      smtpPort: process.env.SMTP_PORT || '587',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'GCC Backend API',
    },
    'Health check operational'
  );
}
