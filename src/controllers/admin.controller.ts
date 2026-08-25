import { NextRequest } from 'next/server';
import { adminService, AdminService } from '@/services/admin.service';
import { loginAdminSchema, registerAdminSchema, updateAdminSchema } from '@/models/admin.model';
import { ApiResponse } from '@/utils/api-response';
import { handleControllerError } from '@/middlewares/error.middleware';
import { logRequest } from '@/middlewares/logger.middleware';
import { requireSuperAdmin, verifyAuthToken } from '@/middlewares/auth.middleware';
import { checkLoginRateLimit } from '@/middlewares/rate-limit.middleware';

export class AdminController {
  constructor(private service: AdminService = adminService) {}

  async register(req: NextRequest) {
    try {
      logRequest(req);
      const body = await req.json();
      const validatedData = registerAdminSchema.parse(body);

      const result = await this.service.register(validatedData);

      const message = result.isSuperAdmin
        ? 'Congratulations! You are the first registered user and have been granted Super Admin status.'
        : 'Registration submitted successfully! Your account is pending approval by a Super Admin.';

      return ApiResponse.created(result, message);
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async login(req: NextRequest) {
    try {
      logRequest(req);
      checkLoginRateLimit(req); // Throttling: 5 login attempts per IP per 1 minute

      const body = await req.json();
      const validatedData = loginAdminSchema.parse(body);

      const result = await this.service.login(validatedData);
      return ApiResponse.success(result, 'Admin authenticated successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getMe(req: NextRequest) {
    try {
      logRequest(req);
      const tokenPayload = verifyAuthToken(req);
      const admin = await this.service.getAdminById(tokenPayload.sub);
      return ApiResponse.success(admin, 'Current admin profile retrieved');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getAllAdmins(req: NextRequest) {
    try {
      logRequest(req);
      requireSuperAdmin(req); // Guard: Super Admin authority required
      const admins = await this.service.getAllAdmins();
      return ApiResponse.success(admins, 'Admin users list retrieved');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async updateAdmin(req: NextRequest, id: string) {
    try {
      logRequest(req);
      requireSuperAdmin(req); // Guard: Super Admin authority required
      const body = await req.json();
      const validatedData = updateAdminSchema.parse(body);

      const updatedAdmin = await this.service.updateAdmin(id, validatedData);
      return ApiResponse.success(updatedAdmin, 'Admin role/status updated successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async deleteAdmin(req: NextRequest, id: string) {
    try {
      logRequest(req);
      const currentUser = requireSuperAdmin(req); // Guard: Super Admin authority required

      if (currentUser.sub === id) {
        return ApiResponse.error('Super Admin cannot delete their own account', 400);
      }

      await this.service.deleteAdmin(id);
      return ApiResponse.success(null, 'Admin account removed successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }
}

export const adminController = new AdminController();
