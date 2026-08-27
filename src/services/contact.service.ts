import { ContactRepository, contactRepository, FilterEnquiriesOptions } from '@/repositories/contact.repository';
import { adminRepository, AdminRepository } from '@/repositories/admin.repository';
import { MailService, mailService } from './mail.service';
import { ContactEnquiry, CreateContactDto, EnquiryStatus } from '@/models/contact.model';
import { NotFoundError } from '@/utils/errors';
import { investorService } from './investor.service';
import { companyService } from './company.service';

export class ContactService {
  constructor(
    private repository: ContactRepository = contactRepository,
    private adminRepo: AdminRepository = adminRepository,
    private mailer: MailService = mailService
  ) {}

  async submitEnquiry(data: CreateContactDto): Promise<{ enquiry: ContactEnquiry; trackingId: string; meetingLink: string }> {
    if (data.formType === 'investor' || data.area === 'investor-relations' || data.area === 'investor-outreach') {
      return investorService.submitEnquiry({
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
    }

    return companyService.submitEnquiry({
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

  async getAllEnquiries(): Promise<ContactEnquiry[]> {
    return this.repository.findAll();
  }

  async getFilteredEnquiries(options: FilterEnquiriesOptions) {
    return this.repository.findWithFilters(options);
  }

  async getCmsDashboardStats() {
    const contactStats = await this.repository.getStats();
    const totalAdmins = await this.adminRepo.countAdmins();
    const allAdmins = await this.adminRepo.findAll();
    const pendingAdmins = allAdmins.filter((a) => a.status === 'PENDING_APPROVAL').length;
    const recentSubmissions = (await this.repository.findAll()).slice(0, 5);

    return {
      enquiries: contactStats,
      admins: {
        total: totalAdmins,
        pendingApproval: pendingAdmins,
      },
      recentSubmissions,
    };
  }

  async getEnquiryById(id: string): Promise<ContactEnquiry> {
    const enquiry = await this.repository.findById(id);
    if (!enquiry) {
      throw new NotFoundError(`Enquiry with ID '${id}' not found`);
    }
    return enquiry;
  }

  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<ContactEnquiry> {
    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundError(`Enquiry with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteEnquiry(id: string): Promise<void> {
    await this.getEnquiryById(id);
    await this.repository.delete(id);
  }
}

export const contactService = new ContactService();
