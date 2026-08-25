import { NextRequest } from 'next/server';
import { contactController } from '@/controllers/contact.controller';

export async function POST(req: NextRequest) {
  return contactController.submitEnquiry(req);
}

export async function GET(req: NextRequest) {
  return contactController.getEnquiries(req);
}
