import { z } from 'zod';

export type ContactMarket = 'ae' | 'sa' | 'qa' | 'kw' | 'bh' | 'om' | 'intl';
export type EnquiryStatus = 'PENDING' | 'REVIEWED' | 'ARCHIVED';

export interface InvestorEnquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  market?: ContactMarket | string;
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

export const createInvestorSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(1, 'Company / Organization name is required'),
  email: z.string().email('Please provide a valid work email address'),
  phone: z.string().optional().or(z.literal('')),
  market: z.enum(['ae', 'sa', 'qa', 'kw', 'bh', 'om', 'intl']).optional().or(z.literal('')),
  area: z.string().default('investor-relations'),
  message: z.string().min(10, 'Message outline must be at least 10 characters'),
  preferredDate: z.string().optional().or(z.literal('')),
  preferredTime: z.string().optional().or(z.literal('')),
  formType: z.literal('investor').optional().default('investor'),
});

export const updateInvestorStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'ARCHIVED']),
});

export type CreateInvestorDto = z.infer<typeof createInvestorSchema>;
export type UpdateInvestorStatusDto = z.infer<typeof updateInvestorStatusSchema>;
