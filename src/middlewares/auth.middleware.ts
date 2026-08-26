import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { ForbiddenError, UnauthorizedError } from '@/utils/errors';
import { AdminRole } from '@/models/admin.model';

export interface AuthPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

/*
// ==================== OLD JWT AUTHENTICATION CODE (COMMENTED OUT) ====================
// import { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { env } from '@/config/env';
//
// export function verifyAuthToken(req: NextRequest): AuthPayload {
//   const authHeader = req.headers.get('authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw new UnauthorizedError('Missing or invalid Authorization header');
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
//     return decoded;
//   } catch {
//     throw new UnauthorizedError('Token is invalid or has expired');
//   }
// }
//
// export function requireSuperAdmin(req: NextRequest): AuthPayload {
//   const user = verifyAuthToken(req);
//   if (user.role !== 'SUPER_ADMIN') {
//     throw new ForbiddenError('Super Admin authority is required for this action');
//   }
//   return user;
// }
// ======================================================================================
*/

// ==================== CLERK AUTHENTICATION CODE ====================
export async function verifyAuthToken(): Promise<{ userId: string; role: string; approved: boolean }> {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError('Missing or invalid authentication token');
  }

  const user = await currentUser();
  let role = user?.publicMetadata?.role as string | undefined;
  let approved = user?.publicMetadata?.approved as boolean | undefined;

  // Auto-promote the first user in Clerk if metadata is not initialized
  if (!role || approved === undefined) {
    const client = await clerkClient();
    const { totalCount } = await client.users.getUserList();

    if (totalCount <= 1) {
      role = 'SUPER_ADMIN';
      approved = true;
    } else {
      role = 'ADMIN';
      approved = false;
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role, approved },
    });
  }

  if (!approved) {
    throw new ForbiddenError('Account is pending approval by Super Admin');
  }

  return { userId, role, approved };
}

export async function requireSuperAdmin(): Promise<{ userId: string }> {
  const { userId, role } = await verifyAuthToken();

  if (role !== 'SUPER_ADMIN') {
    throw new ForbiddenError('Super Admin authority is required for this action');
  }

  return { userId };
}

