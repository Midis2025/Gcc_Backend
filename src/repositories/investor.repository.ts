import mongoose, { Schema, Document } from 'mongoose';
import { InvestorEnquiry, CreateInvestorDto, EnquiryStatus } from '@/models/investor.model';
import { db } from '@/config/db';

export interface IInvestorDocument extends Document {
  name: string;
  company: string;
  email: string;
  phone?: string;
  market?: string;
  area: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  meetingLink?: string;
  status: EnquiryStatus;
  formType: 'investor';
  createdAt: Date;
  updatedAt: Date;
}

const InvestorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    market: { type: String },
    area: { type: String, required: true, default: 'investor-relations' },
    message: { type: String, required: true },
    preferredDate: { type: String },
    preferredTime: { type: String },
    meetingLink: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'ARCHIVED'],
      default: 'PENDING',
    },
    formType: { type: String, default: 'investor' },
  },
  { timestamps: true, collection: 'investorenquiries' }
);

export const InvestorModel =
  mongoose.models.InvestorEnquiry ||
  mongoose.model<IInvestorDocument>('InvestorEnquiry', InvestorSchema);

export interface FilterInvestorOptions {
  search?: string;
  status?: EnquiryStatus;
  area?: string;
  page?: number;
  limit?: number;
}

export class InvestorRepository {
  private inMemoryEnquiries: Map<string, InvestorEnquiry> = new Map();

  async create(data: CreateInvestorDto): Promise<InvestorEnquiry> {
    try {
      await db.connect();
      const doc = await InvestorModel.create({
        ...data,
        formType: 'investor',
        area: data.area || 'investor-relations',
      });
      return this.mapDoc(doc);
    } catch (err) {
      console.warn('[InvestorRepository] MongoDB not reached, saving in-memory:', err);
      const fallback: InvestorEnquiry = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone || undefined,
        market: data.market || undefined,
        area: data.area || 'investor-relations',
        message: data.message,
        preferredDate: data.preferredDate || undefined,
        preferredTime: data.preferredTime || undefined,
        status: 'PENDING',
        formType: 'investor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryEnquiries.set(fallback.id, fallback);
      return fallback;
    }
  }

  async findAll(): Promise<InvestorEnquiry[]> {
    try {
      await db.connect();
      const docs = await InvestorModel.find().sort({ createdAt: -1 });
      return docs.map((doc) => this.mapDoc(doc));
    } catch {
      return Array.from(this.inMemoryEnquiries.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
  }

  async findWithFilters(options: FilterInvestorOptions): Promise<{ items: InvestorEnquiry[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.max(options.limit || 10, 1);
    const skip = (page - 1) * limit;

    try {
      await db.connect();
      const query: Record<string, unknown> = {};

      if (options.status) {
        query.status = options.status;
      }
      if (options.area) {
        query.area = options.area;
      }
      if (options.search) {
        const regex = new RegExp(options.search, 'i');
        query.$or = [{ name: regex }, { company: regex }, { email: regex }];
      }

      const total = await InvestorModel.countDocuments(query);
      const docs = await InvestorModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        items: docs.map((doc) => this.mapDoc(doc)),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch {
      let all = Array.from(this.inMemoryEnquiries.values());
      if (options.status) all = all.filter((i) => i.status === options.status);
      if (options.area) all = all.filter((i) => i.area === options.area);
      if (options.search) {
        const q = options.search.toLowerCase();
        all = all.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.company.toLowerCase().includes(q) ||
            i.email.toLowerCase().includes(q)
        );
      }
      const total = all.length;
      const items = all.slice(skip, skip + limit);
      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }
  }

  async getStats(): Promise<{ total: number; pending: number; reviewed: number; archived: number }> {
    try {
      await db.connect();
      const total = await InvestorModel.countDocuments();
      const pending = await InvestorModel.countDocuments({ status: 'PENDING' });
      const reviewed = await InvestorModel.countDocuments({ status: 'REVIEWED' });
      const archived = await InvestorModel.countDocuments({ status: 'ARCHIVED' });

      return { total, pending, reviewed, archived };
    } catch {
      const all = Array.from(this.inMemoryEnquiries.values());
      return {
        total: all.length,
        pending: all.filter((i) => i.status === 'PENDING').length,
        reviewed: all.filter((i) => i.status === 'REVIEWED').length,
        archived: all.filter((i) => i.status === 'ARCHIVED').length,
      };
    }
  }

  async findById(id: string): Promise<InvestorEnquiry | null> {
    try {
      await db.connect();
      const doc = await InvestorModel.findById(id);
      if (!doc) return this.inMemoryEnquiries.get(id) || null;
      return this.mapDoc(doc);
    } catch {
      return this.inMemoryEnquiries.get(id) || null;
    }
  }

  async updateStatus(id: string, status: EnquiryStatus): Promise<InvestorEnquiry | null> {
    try {
      await db.connect();
      const doc = await InvestorModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!doc) {
        const existing = this.inMemoryEnquiries.get(id);
        if (!existing) return null;
        const updated = { ...existing, status, updatedAt: new Date() };
        this.inMemoryEnquiries.set(id, updated);
        return updated;
      }
      return this.mapDoc(doc);
    } catch {
      const existing = this.inMemoryEnquiries.get(id);
      if (!existing) return null;
      const updated = { ...existing, status, updatedAt: new Date() };
      this.inMemoryEnquiries.set(id, updated);
      return updated;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await db.connect();
      const result = await InvestorModel.findByIdAndDelete(id);
      this.inMemoryEnquiries.delete(id);
      return !!result;
    } catch {
      return this.inMemoryEnquiries.delete(id);
    }
  }

  private mapDoc(doc: IInvestorDocument): InvestorEnquiry {
    return {
      id: doc._id.toString(),
      name: doc.name,
      company: doc.company,
      email: doc.email,
      phone: doc.phone,
      market: doc.market,
      area: doc.area,
      message: doc.message,
      preferredDate: doc.preferredDate,
      preferredTime: doc.preferredTime,
      meetingLink: doc.meetingLink,
      status: doc.status as EnquiryStatus,
      formType: 'investor',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

export const investorRepository = new InvestorRepository();
