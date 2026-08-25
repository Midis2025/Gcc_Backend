import { NextRequest } from 'next/server';
import { adminController } from '@/controllers/admin.controller';

export async function POST(req: NextRequest) {
  return adminController.register(req);
}
