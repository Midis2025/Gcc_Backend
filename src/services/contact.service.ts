import { ContactRepository, contactRepository, FilterEnquiriesOptions } from '@/repositories/contact.repository';
import { adminRepository, AdminRepository } from '@/repositories/admin.repository';
import { MailService, mailService } from './mail.service';
import { ContactEnquiry, CreateContactDto, EnquiryStatus } from '@/models/contact.model';
import { NotFoundError } from '@/utils/errors';

export class ContactService {
  constructor(
    private repository: ContactRepository = contactRepository,
    private adminRepo: AdminRepository = adminRepository,
    private mailer: MailService = mailService
  ) {}

  async submitEnquiry(data: CreateContactDto): Promise<{ enquiry: ContactEnquiry; trackingId: string; meetingLink: string }> {
    const enquiry = await this.repository.create(data);
    const meetingLink = `https://meet.jit.si/GCC-Consultation-${enquiry.id}`;

    await this.mailer.sendMeetingEmails({
      name: enquiry.name,
      email: enquiry.email,
      company: enquiry.company,
      preferredDate: enquiry.preferredDate,
      preferredTime: enquiry.preferredTime,
      enquiryId: enquiry.id,
      area: enquiry.area,
      message: enquiry.message,
    });

    return {
      enquiry,
      trackingId: enquiry.id,
      meetingLink,
    };
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
