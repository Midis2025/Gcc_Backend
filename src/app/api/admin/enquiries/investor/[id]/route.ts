import { NextRequest } from 'next/server';
import { investorController } from '@/controllers/investor.controller';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return investorController.getEnquiryById(req, params.id);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return investorController.updateStatus(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return investorController.deleteEnquiry(req, params.id);
}
