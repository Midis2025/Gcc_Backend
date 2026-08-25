import { z } from 'zod';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';
export type AdminStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const registerAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginAdminSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateAdminSchema = z.object({
  status: z.enum(['APPROVED', 'PENDING_APPROVAL', 'REJECTED']).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional(),
});

export type RegisterAdminDto = z.infer<typeof registerAdminSchema>;
export type LoginAdminDto = z.infer<typeof loginAdminSchema>;
export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
