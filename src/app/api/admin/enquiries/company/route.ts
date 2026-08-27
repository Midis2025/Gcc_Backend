import { NextRequest } from 'next/server';
import { companyController } from '@/controllers/company.controller';

export async function GET(req: NextRequest) {
  return companyController.getFilteredEnquiries(req);
}
