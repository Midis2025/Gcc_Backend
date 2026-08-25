import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminRepository, AdminRepository } from '@/repositories/admin.repository';
import { AdminRole, AdminStatus, AdminUser, LoginAdminDto, RegisterAdminDto, UpdateAdminDto } from '@/models/admin.model';
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from '@/utils/errors';
import { env } from '@/config/env';

export class AdminService {
  constructor(private repository: AdminRepository = adminRepository) {}

  async register(data: RegisterAdminDto): Promise<{ admin: AdminUser; isSuperAdmin: boolean }> {
    // 1. Check if email is already registered
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`Admin with email '${data.email}' already exists`);
    }

    // 2. Check total admin count to enforce First-User Super Admin logic
    const totalAdmins = await this.repository.countAdmins();
    const isFirstUser = totalAdmins === 0;

    const role: AdminRole = isFirstUser ? 'SUPER_ADMIN' : 'ADMIN';
    const status: AdminStatus = isFirstUser ? 'APPROVED' : 'PENDING_APPROVAL';

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // 4. Create admin user
    const admin = await this.repository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordHash,
      role,
      status,
    });

    console.log(
      `[AdminService] Registered admin ${admin.email} -> Role: ${role}, Status: ${status} (First User: ${isFirstUser})`
    );

    return {
      admin,
      isSuperAdmin: isFirstUser,
    };
  }

  async login(data: LoginAdminDto): Promise<{ admin: AdminUser; token: string }> {
    // 1. Find admin by email
    const adminWithHash = await this.repository.findByEmail(data.email);
    if (!adminWithHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(data.password, adminWithHash.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 3. Verify approval status
    if (adminWithHash.status === 'PENDING_APPROVAL') {
      throw new ForbiddenError('Your account is pending approval by a Super Admin');
    }
    if (adminWithHash.status === 'REJECTED') {
      throw new ForbiddenError('Your account registration request has been rejected');
    }

    // 4. Generate JWT Token
    const payload = {
      sub: adminWithHash.id,
      email: adminWithHash.email,
      role: adminWithHash.role,
      name: adminWithHash.name,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...admin } = adminWithHash;

    return {
      admin,
      token,
    };
  }

  async getAdminById(id: string): Promise<AdminUser> {
    const admin = await this.repository.findById(id);
    if (!admin) {
      throw new NotFoundError(`Admin user with ID '${id}' not found`);
    }
    return admin;
  }

  async getAllAdmins(): Promise<AdminUser[]> {
    return this.repository.findAll();
  }

  async updateAdmin(id: string, updateDto: UpdateAdminDto): Promise<AdminUser> {
    const admin = await this.getAdminById(id);
    const updated = await this.repository.update(admin.id, updateDto);
    if (!updated) {
      throw new NotFoundError(`Admin user with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteAdmin(id: string): Promise<void> {
    await this.getAdminById(id);
    await this.repository.delete(id);
  }
}

export const adminService = new AdminService();
