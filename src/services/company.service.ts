import { CompanyRepository, companyRepository, FilterCompanyOptions } from '@/repositories/company.repository';
import { MailService, mailService } from './mail.service';
import { CompanyEnquiry, CreateCompanyDto, EnquiryStatus } from '@/models/company.model';
import { NotFoundError } from '@/utils/errors';

export class CompanyService {
  constructor(
    private repository: CompanyRepository = companyRepository,
    private mailer: MailService = mailService
  ) {}

  async submitEnquiry(data: CreateCompanyDto): Promise<{ enquiry: CompanyEnquiry; trackingId: string; meetingLink: string }> {
    const enquiry = await this.repository.create(data);
    const meetingLink = `https://meet.jit.si/GCC-Consultation-${enquiry.id}`;

    // Send meeting email confirmation to both user and admin
    await this.mailer.sendMeetingEmails({
      name: enquiry.name,
      email: enquiry.email,
      company: enquiry.company,
      preferredDate: enquiry.preferredDate,
      preferredTime: enquiry.preferredTime,
      enquiryId: enquiry.id,
      area: `[Company Form] ${enquiry.area}`,
      message: enquiry.message,
    });

    return {
      enquiry,
      trackingId: enquiry.id,
      meetingLink,
    };
  }

  async getAllEnquiries(): Promise<CompanyEnquiry[]> {
    return this.repository.findAll();
  }

  async getFilteredEnquiries(options: FilterCompanyOptions) {
    return this.repository.findWithFilters(options);
  }

  async getStats() {
    return this.repository.getStats();
  }

  async getEnquiryById(id: string): Promise<CompanyEnquiry> {
    const enquiry = await this.repository.findById(id);
    if (!enquiry) {
      throw new NotFoundError(`Company enquiry with ID '${id}' not found`);
    }
    return enquiry;
  }

  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<CompanyEnquiry> {
    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundError(`Company enquiry with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteEnquiry(id: string): Promise<void> {
    await this.getEnquiryById(id);
    await this.repository.delete(id);
  }
}

export const companyService = new CompanyService();
