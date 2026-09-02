import { NextRequest, NextResponse } from 'next/server';
import {
  generateInvestorAdminEmail,
  generateCompanyConfirmationEmail,
  generateCompanyAdminEmail,
} from '@/templates/email-templates';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') || 'company';
  const format = searchParams.get('format');

  const sampleData = {
    name: searchParams.get('name') || 'Jane Doe',
    email: searchParams.get('email') || 'jane.doe@example.com',
    company: searchParams.get('company') || 'Apex Capital Partners',
    phone: '+971 50 123 4567',
    market: 'ae',
    jobTitle: 'Managing Partner',
    investorType: 'Venture Capital & Private Equity',
    area: 'Regional Expansion & Capital Markets',
    message: 'Seeking investor relations and strategic positioning support across GCC markets.',
  };

  const calendlyLink = `https://calendly.com/gulfconnectconsultancy-info/30min?name=${encodeURIComponent(sampleData.name)}&email=${encodeURIComponent(sampleData.email)}`;

  let htmlContent = '';
  if (template === 'investor-admin' || template === 'investor') {
    htmlContent = generateInvestorAdminEmail(sampleData);
  } else if (template === 'company-admin') {
    htmlContent = generateCompanyAdminEmail(sampleData);
  } else {
    htmlContent = generateCompanyConfirmationEmail(sampleData, calendlyLink);
  }

  if (format === 'raw') {
    return new NextResponse(htmlContent, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(htmlContent, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

