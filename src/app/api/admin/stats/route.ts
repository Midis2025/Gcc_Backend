export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { contactController } from '@/controllers/contact.controller';

export async function GET(req: NextRequest) {
  return contactController.getCmsStats(req);
}
