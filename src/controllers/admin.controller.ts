import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { handleControllerError } from '@/middlewares/error.middleware';
import { logRequest } from '@/middlewares/logger.middleware';
import { requireSuperAdmin, verifyAuthToken } from '@/middlewares/auth.middleware';
import { clerkClient } from '@clerk/nextjs/server';

export class AdminController {
  async getMe(req: NextRequest) {
    try {
      logRequest(req);
      const { userId } = await verifyAuthToken();
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      return ApiResponse.success(
        {
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress,
          email: user.emailAddresses[0]?.emailAddress,
          role: (user.publicMetadata?.role as string) || 'ADMIN',
          approved: !!user.publicMetadata?.approved,
        },
        'Current admin profile retrieved'
      );
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getAllAdmins(req: NextRequest) {
    try {
      logRequest(req);
      await requireSuperAdmin(); // Guard: Super Admin authority required
      const client = await clerkClient();
      const { data: users } = await client.users.getUserList({ limit: 100 });

      const admins = users.map((u) => ({
        id: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.emailAddresses[0]?.emailAddress || 'Admin User',
        email: u.emailAddresses[0]?.emailAddress || '',
        imageUrl: u.imageUrl,
        role: (u.publicMetadata?.role as string) || 'ADMIN',
        status: u.publicMetadata?.approved ? 'ACTIVE' : 'PENDING',
        approved: !!u.publicMetadata?.approved,
        createdAt: new Date(u.createdAt).toISOString(),
      }));

      return ApiResponse.success(admins, 'Admin users list retrieved');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async updateAdmin(req: NextRequest, id: string) {
    try {
      logRequest(req);
      await requireSuperAdmin(); // Guard: Super Admin authority required
      const body = await req.json();
      const client = await clerkClient();

      const existingUser = await client.users.getUser(id);
      const currentMeta = existingUser.publicMetadata || {};

      const updatedMeta = {
        ...currentMeta,
        ...(body.role ? { role: body.role } : {}),
        ...(body.status === 'ACTIVE' || body.approved === true ? { approved: true } : {}),
        ...(body.status === 'PENDING' || body.approved === false ? { approved: false } : {}),
      };

      const updatedUser = await client.users.updateUserMetadata(id, {
        publicMetadata: updatedMeta,
      });

      return ApiResponse.success(
        {
          id: updatedUser.id,
          role: updatedUser.publicMetadata?.role,
          approved: updatedUser.publicMetadata?.approved,
        },
        'Admin role/status updated successfully'
      );
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async deleteAdmin(req: NextRequest, id: string) {
    try {
      logRequest(req);
      const currentUser = await requireSuperAdmin(); // Guard: Super Admin authority required

      if (currentUser.userId === id) {
        return ApiResponse.error('Super Admin cannot delete their own account', 400);
      }

      const client = await clerkClient();
      await client.users.deleteUser(id);

      return ApiResponse.success(null, 'Admin account removed successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }
}

export const adminController = new AdminController();
