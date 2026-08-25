import { NextRequest } from 'next/server';
import { adminController } from '@/controllers/admin.controller';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return adminController.updateAdmin(req, params.id);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return adminController.deleteAdmin(req, params.id);
}
