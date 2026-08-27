import { z } from 'zod';
import { InvestorEnquiry, createInvestorSchema } from './investor.model';
import { CompanyEnquiry, createCompanySchema } from './company.model';

export type ContactMarket = 'ae' | 'sa' | 'qa' | 'kw' | 'bh' | 'om' | 'intl';
export type ContactArea =
  | 'investor-relations'
  | 'investor-outreach'
  | 'media-relations'
  | 'digital-communications'
  | 'general';
export type EnquiryStatus = 'PENDING' | 'REVIEWED' | 'ARCHIVED';
export type ContactFormType = 'investor' | 'company';

export interface ContactEnquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  market?: ContactMarket | string;
  area: ContactArea | string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  meetingLink?: string;
  status: EnquiryStatus;
  formType?: ContactFormType;
  createdAt: Date;
  updatedAt: Date;
}

export const createContactSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(1, 'Company name is required'),
  email: z.string().email('Please provide a valid work email address'),
  phone: z.string().optional().or(z.literal('')),
  market: z.string().optional().or(z.literal('')),
  area: z.string().optional().default('general'),
  message: z.string().optional().or(z.literal('')).default('General enquiry submission'),
  preferredDate: z.string().optional().or(z.literal('')),
  preferredTime: z.string().optional().or(z.literal('')),
  formType: z.enum(['investor', 'company']).optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'ARCHIVED']),
});

export type CreateContactDto = z.infer<typeof createContactSchema>;
export type UpdateEnquiryStatusDto = z.infer<typeof updateEnquiryStatusSchema>;

export * from './investor.model';
export * from './company.model';
