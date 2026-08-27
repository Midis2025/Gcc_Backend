import { NextRequest } from 'next/server';
import { investorService, InvestorService } from '@/services/investor.service';
import { createInvestorSchema, EnquiryStatus, updateInvestorStatusSchema } from '@/models/investor.model';
import { ApiResponse } from '@/utils/api-response';
import { handleControllerError } from '@/middlewares/error.middleware';
import { logRequest } from '@/middlewares/logger.middleware';
import { verifyAuthToken } from '@/middlewares/auth.middleware';
import { checkContactRateLimit } from '@/middlewares/rate-limit.middleware';

export class InvestorController {
  constructor(private service: InvestorService = investorService) {}

  async submitEnquiry(req: NextRequest) {
    try {
      logRequest(req);
      checkContactRateLimit(req);

      const body = await req.json();
      const validatedData = createInvestorSchema.parse(body);

      const result = await this.service.submitEnquiry(validatedData);

      return ApiResponse.created(
        result,
        'Thank you! Your investor enquiry has been received and scheduled with our team.'
      );
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getFilteredEnquiries(req: NextRequest) {
    try {
      logRequest(req);
      await verifyAuthToken();

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

      return ApiResponse.success(result, 'Investor enquiries retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async getEnquiryById(req: NextRequest, id: string) {
    try {
      logRequest(req);
      await verifyAuthToken();
      const enquiry = await this.service.getEnquiryById(id);
      return ApiResponse.success(enquiry, 'Investor enquiry details retrieved successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async updateStatus(req: NextRequest, id: string) {
    try {
      logRequest(req);
      await verifyAuthToken();
      const body = await req.json();
      const { status } = updateInvestorStatusSchema.parse(body);

      const updated = await this.service.updateEnquiryStatus(id, status);
      return ApiResponse.success(updated, 'Investor enquiry status updated successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }

  async deleteEnquiry(req: NextRequest, id: string) {
    try {
      logRequest(req);
      await verifyAuthToken();
      await this.service.deleteEnquiry(id);
      return ApiResponse.success(null, 'Investor enquiry removed successfully');
    } catch (error) {
      return handleControllerError(error);
    }
  }
}

export const investorController = new InvestorController();
