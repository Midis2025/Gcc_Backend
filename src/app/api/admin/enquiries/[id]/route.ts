import { NextRequest } from 'next/server';
import { contactController } from '@/controllers/contact.controller';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return contactController.getEnquiryById(req, params.id);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return contactController.updateStatus(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return contactController.deleteEnquiry(req, params.id);
}
