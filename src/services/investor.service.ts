import { InvestorRepository, investorRepository, FilterInvestorOptions } from '@/repositories/investor.repository';
import { MailService, mailService } from './mail.service';
import { InvestorEnquiry, CreateInvestorDto, EnquiryStatus } from '@/models/investor.model';
import { NotFoundError } from '@/utils/errors';

export class InvestorService {
  constructor(
    private repository: InvestorRepository = investorRepository,
    private mailer: MailService = mailService
  ) {}

  async submitEnquiry(data: CreateInvestorDto): Promise<{ enquiry: InvestorEnquiry; trackingId: string; meetingLink: string }> {
    const enquiry = await this.repository.create(data);
    const meetingLink = `https://meet.jit.si/GCC-Consultation-${enquiry.id}`;

    // Send meeting email confirmation to both user and admin
    await this.mailer.sendInvestorEmails({
      name: enquiry.name,
      email: enquiry.email,
      company: enquiry.company,
      phone: enquiry.phone,
      market: enquiry.market,
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

  async getAllEnquiries(): Promise<InvestorEnquiry[]> {
    return this.repository.findAll();
  }

  async getFilteredEnquiries(options: FilterInvestorOptions) {
    return this.repository.findWithFilters(options);
  }

  async getStats() {
    return this.repository.getStats();
  }

  async getEnquiryById(id: string): Promise<InvestorEnquiry> {
    const enquiry = await this.repository.findById(id);
    if (!enquiry) {
      throw new NotFoundError(`Investor enquiry with ID '${id}' not found`);
    }
    return enquiry;
  }

  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<InvestorEnquiry> {
    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new NotFoundError(`Investor enquiry with ID '${id}' not found`);
    }
    return updated;
  }

  async deleteEnquiry(id: string): Promise<void> {
    await this.getEnquiryById(id);
    await this.repository.delete(id);
  }
}

export const investorService = new InvestorService();
