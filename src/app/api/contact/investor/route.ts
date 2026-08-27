import { NextRequest } from 'next/server';
import { investorController } from '@/controllers/investor.controller';

export async function POST(req: NextRequest) {
  return investorController.submitEnquiry(req);
}
