import { NextRequest } from 'next/server';
import { investorController } from '@/controllers/investor.controller';

export async function GET(req: NextRequest) {
  return investorController.getFilteredEnquiries(req);
}
