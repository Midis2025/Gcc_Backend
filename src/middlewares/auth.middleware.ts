import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { ForbiddenError, UnauthorizedError } from '@/utils/errors';
import { AdminRole } from '@/models/admin.model';

export interface AuthPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

export function verifyAuthToken(req: NextRequest): AuthPayload {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    return decoded;
  } catch {
    throw new UnauthorizedError('Token is invalid or has expired');
  }
}

export function requireSuperAdmin(req: NextRequest): AuthPayload {
  const user = verifyAuthToken(req);
  if (user.role !== 'SUPER_ADMIN') {
    throw new ForbiddenError('Super Admin authority is required for this action');
  }
  return user;
}
