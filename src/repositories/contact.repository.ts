import { ContactEnquiry, CreateContactDto, EnquiryStatus } from '@/models/contact.model';
import { investorRepository } from './investor.repository';
import { companyRepository } from './company.repository';

export interface FilterEnquiriesOptions {
  search?: string;
  status?: EnquiryStatus;
  area?: string;
  formType?: 'investor' | 'company' | 'all';
  page?: number;
  limit?: number;
}

export class ContactRepository {
  async create(data: CreateContactDto): Promise<ContactEnquiry> {
    if (data.formType === 'investor' || data.area === 'investor-relations' || data.area === 'investor-outreach') {
      return investorRepository.create({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        market: data.market,
        area: data.area || 'investor-relations',
        message: data.message,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        formType: 'investor',
      });
    } else {
      return companyRepository.create({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        market: data.market,
        area: data.area || 'general',
        message: data.message,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        formType: 'company',
      });
    }
  }

  async findAll(): Promise<ContactEnquiry[]> {
    const investors = await investorRepository.findAll();
    const companies = await companyRepository.findAll();
    const combined = [...investors, ...companies];
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findWithFilters(options: FilterEnquiriesOptions): Promise<{ items: ContactEnquiry[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.max(options.limit || 10, 1);

    if (options.formType === 'investor') {
      return investorRepository.findWithFilters(options);
    }
    if (options.formType === 'company') {
      return companyRepository.findWithFilters(options);
    }

    const allInvestors = await investorRepository.findAll();
    const allCompanies = await companyRepository.findAll();
    let combined: ContactEnquiry[] = [...allInvestors, ...allCompanies];

    if (options.status) {
      combined = combined.filter((i) => i.status === options.status);
    }
    if (options.area) {
      combined = combined.filter((i) => i.area === options.area);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      combined = combined.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q)
      );
    }

    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = combined.length;
    const skip = (page - 1) * limit;
    const items = combined.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    archived: number;
    investor: { total: number; pending: number; reviewed: number; archived: number };
    company: { total: number; pending: number; reviewed: number; archived: number };
  }> {
    const investorStats = await investorRepository.getStats();
    const companyStats = await companyRepository.getStats();

    return {
      total: investorStats.total + companyStats.total,
      pending: investorStats.pending + companyStats.pending,
      reviewed: investorStats.reviewed + companyStats.reviewed,
      archived: investorStats.archived + companyStats.archived,
      investor: investorStats,
      company: companyStats,
    };
  }

  async findById(id: string): Promise<ContactEnquiry | null> {
    const inv = await investorRepository.findById(id);
    if (inv) return inv;
    const comp = await companyRepository.findById(id);
    if (comp) return comp;
    return null;
  }

  async updateStatus(id: string, status: EnquiryStatus): Promise<ContactEnquiry | null> {
    const inv = await investorRepository.updateStatus(id, status);
    if (inv) return inv;
    const comp = await companyRepository.updateStatus(id, status);
    if (comp) return comp;
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const invDeleted = await investorRepository.delete(id);
    if (invDeleted) return true;
    const compDeleted = await companyRepository.delete(id);
    return compDeleted;
  }
}

export const contactRepository = new ContactRepository();
