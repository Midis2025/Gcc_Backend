import { NextRequest } from 'next/server';
import { companyController } from '@/controllers/company.controller';

export async function POST(req: NextRequest) {
  return companyController.submitEnquiry(req);
}
