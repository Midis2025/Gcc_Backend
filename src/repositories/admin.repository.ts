import mongoose, { Schema, Document } from 'mongoose';
import { AdminRole, AdminStatus, AdminUser, RegisterAdminDto, UpdateAdminDto } from '@/models/admin.model';
import { db } from '@/config/db';

export interface IAdminDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN'], default: 'ADMIN' },
    status: {
      type: String,
      enum: ['APPROVED', 'PENDING_APPROVAL', 'REJECTED'],
      default: 'PENDING_APPROVAL',
    },
  },
  { timestamps: true }
);

export const AdminModel =
  mongoose.models.Admin || mongoose.model<IAdminDocument>('Admin', AdminSchema);

export class AdminRepository {
  private inMemoryAdmins: Map<string, AdminUser & { passwordHash: string }> = new Map();

  async countAdmins(): Promise<number> {
    try {
      await db.connect();
      return await AdminModel.countDocuments();
    } catch {
      return this.inMemoryAdmins.size;
    }
  }

  async findByEmail(email: string): Promise<(AdminUser & { passwordHash: string }) | null> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await db.connect();
      const doc = await AdminModel.findOne({ email: cleanEmail });
      if (!doc) return this.findInMemoryByEmail(cleanEmail);
      return this.mapDocToAdmin(doc);
    } catch {
      return this.findInMemoryByEmail(cleanEmail);
    }
  }

  async findById(id: string): Promise<AdminUser | null> {
    try {
      await db.connect();
      const doc = await AdminModel.findById(id);
      if (!doc) return this.findInMemoryById(id);
      return this.mapDocToAdmin(doc);
    } catch {
      return this.findInMemoryById(id);
    }
  }

  async create(data: RegisterAdminDto & { passwordHash: string; role: AdminRole; status: AdminStatus }): Promise<AdminUser> {
    const cleanEmail = data.email.trim().toLowerCase();
    try {
      await db.connect();
      const doc = await AdminModel.create({
        name: data.name,
        email: cleanEmail,
        passwordHash: data.passwordHash,
        role: data.role,
        status: data.status,
      });
      return this.mapDocToAdmin(doc);
    } catch (err) {
      console.warn('[AdminRepository] MongoDB not reached, saving in-memory:', err);
      const fallback: AdminUser & { passwordHash: string } = {
        id: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: cleanEmail,
        passwordHash: data.passwordHash,
        role: data.role,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryAdmins.set(fallback.id, fallback);
      return this.sanitizeAdmin(fallback);
    }
  }

  async findAll(): Promise<AdminUser[]> {
    try {
      await db.connect();
      const docs = await AdminModel.find().sort({ createdAt: 1 });
      return docs.map((doc) => this.mapDocToAdmin(doc));
    } catch {
      return Array.from(this.inMemoryAdmins.values()).map((adm) => this.sanitizeAdmin(adm));
    }
  }

  async update(id: string, data: UpdateAdminDto): Promise<AdminUser | null> {
    try {
      await db.connect();
      const doc = await AdminModel.findByIdAndUpdate(id, data, { new: true });
      if (!doc) return null;
      return this.mapDocToAdmin(doc);
    } catch {
      const existing = this.inMemoryAdmins.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.inMemoryAdmins.set(id, updated);
      return this.sanitizeAdmin(updated);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await db.connect();
      const res = await AdminModel.findByIdAndDelete(id);
      return !!res;
    } catch {
      return this.inMemoryAdmins.delete(id);
    }
  }

  private mapDocToAdmin(doc: IAdminDocument): AdminUser & { passwordHash: string } {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private sanitizeAdmin(admin: AdminUser & { passwordHash: string }): AdminUser {
    const { passwordHash: _, ...sanitized } = admin;
    return sanitized;
  }

  private findInMemoryByEmail(email: string): (AdminUser & { passwordHash: string }) | null {
    const cleanEmail = email.trim().toLowerCase();
    for (const adm of this.inMemoryAdmins.values()) {
      if (adm.email.toLowerCase() === cleanEmail) return adm;
    }
    return null;
  }

  private findInMemoryById(id: string): AdminUser | null {
    const adm = this.inMemoryAdmins.get(id);
    return adm ? this.sanitizeAdmin(adm) : null;
  }
}

export const adminRepository = new AdminRepository();
