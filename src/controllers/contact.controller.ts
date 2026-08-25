import { NextRequest } from 'next/server';
import { contactService, ContactService } from '@/services/contact.service';
import { createContactSchema, EnquiryStatus, updateEnquiryStatusSchema } from '@/models/contact.model';
import { ApiResponse } from '@/utils/api-response';
import { handleControllerError } from '@/middlewares/error.middleware';
import { logRequest } from '@/middlewares/logger.middleware';
import { verifyAuthToken } from '@/middlewares/auth.middleware';
import { checkContactRateLimit } from '@/middlewares/rate-limit.middleware';

export class ContactController {
  constructor(private service: ContactService = contactService) {}

  async submitEnquiry(req: NextRequest) {
    try {
      logRequest(req);
      checkContactRateLimit(req); // Throttling: 300 submissions per IP per 10 minutes

      const body = await req.json();
      const validatedData = createContactSchema.parse(body);

      const result = await this.service.submitEnquiry(validatedData);

      return ApiResponse.created(
        result,
        'Thank you! Your enquiry has been received and is being reviewed by our team.'
      );
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getFilteredEnquiries(req: NextRequest) {
    try {
      logRequest(req);
      verifyAuthToken(req); // Guard: Requires Admin authentication

      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const status = (searchParams.get('status') as EnquiryStatus) || undefined;
      const area = searchParams.get('area') || undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const result = await this.service.getFilteredEnquiries({
        search,
        status,
        area,
        page,
        limit,
      });

      return ApiResponse.success(result, 'Filtered enquiries retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getCmsStats(req: NextRequest) {
    try {
      logRequest(req);
      verifyAuthToken(req); // Guard: Requires Admin authentication

      const stats = await this.service.getCmsDashboardStats();
      return ApiResponse.success(stats, 'CMS Dashboard stats retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getEnquiries(req: NextRequest) {
    try {
      logRequest(req);
      const enquiries = await this.service.getAllEnquiries();
      return ApiResponse.success(enquiries, 'Enquiries retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getEnquiryById(req: NextRequest, id: string) {
    try {
      logRequest(req);
      verifyAuthToken(req); // Guard: Requires Admin authentication
      const enquiry = await this.service.getEnquiryById(id);
      return ApiResponse.success(enquiry, 'Enquiry details retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async updateStatus(req: NextRequest, id: string) {
    try {
      logRequest(req);
      verifyAuthToken(req); // Guard: Requires Admin authentication
      const body = await req.json();
      const { status } = updateEnquiryStatusSchema.parse(body);

      const updated = await this.service.updateEnquiryStatus(id, status);
      return ApiResponse.success(updated, 'Enquiry status updated successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async deleteEnquiry(req: NextRequest, id: string) {
    try {
      logRequest(req);
      verifyAuthToken(req); // Guard: Requires Admin authentication
      await this.service.deleteEnquiry(id);
      return ApiResponse.success(null, 'Enquiry removed successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }
}

export const contactController = new ContactController();
