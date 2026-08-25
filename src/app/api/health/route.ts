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

  return ApiResponse.success(
    {
      status: 'UP',
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'GCC Backend API',
    },
    'Health check operational'
  );
}
