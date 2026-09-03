export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { adminController } from '@/controllers/admin.controller';

export async function GET(req: NextRequest) {
  return adminController.getMe(req);
}
