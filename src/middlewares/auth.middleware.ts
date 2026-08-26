import { auth } from '@clerk/nextjs/server';
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
export async function verifyAuthToken(): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError('Missing or invalid authentication token');
  }
  return { userId };
}

export async function requireSuperAdmin(): Promise<{ userId: string }> {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    throw new UnauthorizedError('Missing or invalid authentication token');
  }
  const role = (sessionClaims?.metadata as Record<string, unknown>)?.role;
  if (role !== 'SUPER_ADMIN') {
    throw new ForbiddenError('Super Admin authority is required for this action');
  }
  return { userId };
}

