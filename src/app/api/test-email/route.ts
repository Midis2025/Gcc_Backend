import { NextRequest, NextResponse } from 'next/server';
import {
  generateInvestorAdminEmail,
  generateCompanyAdminEmail,
  generateCompanyConfirmationEmail,
  generateInvestorConfirmationEmail,
} from '@/templates/email-templates';

/**
 * Renders a template in the browser so the design can be checked without
 * sending anything.
 *
 *   /api/test-email?template=company           client confirmation (PDF 1)
 *   /api/test-email?template=investor-admin    admin alert        (PDF 2)
 *   /api/test-email?template=investor          investor confirmation
 *   /api/test-email?template=company-admin     admin alert (company)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') || 'company';

  const sampleData = {
    name: searchParams.get('name') || 'Jane Doe',
    email: searchParams.get('email') || 'jane.doe@example.com',
    company: searchParams.get('company') || 'Apex Capital Partners',
    phone: '+971 50 123 4567',
    market: 'ae',
    jobTitle: 'Managing Partner',
    location: 'Dubai, United Arab Emirates',
    investorType: 'Venture Capital & Private Equity',
    investmentInterests: 'Sukuk issuance, regional IPOs and infrastructure funds',
    area: 'Regional Expansion & Capital Markets',
    message: 'Seeking investor relations and strategic positioning support across GCC markets.',
  };

  const meetingLink = `https://calendly.com/gulfconnectconsultancy-info/30min?name=${encodeURIComponent(
    sampleData.name
  )}&email=${encodeURIComponent(sampleData.email)}`;

  let htmlContent: string;
  if (template === 'investor-admin') {
    htmlContent = generateInvestorAdminEmail(sampleData);
  } else if (template === 'company-admin') {
    htmlContent = generateCompanyAdminEmail(sampleData);
  } else if (template === 'investor') {
    htmlContent = generateInvestorConfirmationEmail(sampleData, meetingLink);
  } else {
    htmlContent = generateCompanyConfirmationEmail(sampleData, meetingLink);
  }

  return new NextResponse(htmlContent, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
