import { NextRequest } from 'next/server';
import { companyController } from '@/controllers/company.controller';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return companyController.getEnquiryById(req, params.id);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return companyController.updateStatus(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return companyController.deleteEnquiry(req, params.id);
}
