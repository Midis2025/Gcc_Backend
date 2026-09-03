import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/db';
import { CompanyModel } from '@/repositories/company.repository';
import { InvestorModel } from '@/repositories/investor.repository';

export const runtime = 'nodejs';

function formatCalendlyDate(isoString?: string): { date: string; time: string } {
  if (!isoString) return { date: '', time: '' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: isoString, time: '' };

    const dateStr = d.toISOString().split('T')[0];
    const timeStr = `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')} UTC`;
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: isoString || '', time: '' };
  }
}

async function updateEnquiryByEmail(
  email: string,
  preferredDate: string,
  preferredTime: string,
  meetingLink?: string
) {
  await db.connect();
  const filter = { email: new RegExp(`^${email.trim()}$`, 'i') };
  const update = {
    $set: {
      preferredDate,
      preferredTime,
      status: 'REVIEWED',
      ...(meetingLink ? { meetingLink } : {}),
      updatedAt: new Date(),
    },
  };

  // Try updating Company Enquiry first
  const companyDoc = await CompanyModel.findOneAndUpdate(filter, update, { new: true, sort: { createdAt: -1 } });
  if (companyDoc) {
    console.log(`[Calendly Webhook] Updated company enquiry for ${email}:`, preferredDate, preferredTime);
    return { type: 'company', doc: companyDoc };
  }

  // Otherwise try updating Investor Enquiry
  const investorDoc = await InvestorModel.findOneAndUpdate(filter, update, { new: true, sort: { createdAt: -1 } });
  if (investorDoc) {
    console.log(`[Calendly Webhook] Updated investor enquiry for ${email}:`, preferredDate, preferredTime);
    return { type: 'investor', doc: investorDoc };
  }

  console.warn(`[Calendly Webhook] No matching enquiry found for email: ${email}`);
  return null;
}

/**
 * Handles Calendly Webhooks (POST) and Redirects (GET)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Calendly Webhook Event (invitee.created)
    if (body.event === 'invitee.created' || body.payload) {
      const payload = body.payload || {};
      const email = payload.email || payload.invitee?.email;
      const startTime = payload.scheduled_event?.start_time || payload.event?.start_time;
      const joinUrl = payload.scheduled_event?.location?.join_url || payload.event?.location?.join_url;

      if (email && startTime) {
        const { date, time } = formatCalendlyDate(startTime);
        const result = await updateEnquiryByEmail(email, date, time, joinUrl);
        return NextResponse.json({ success: true, updated: !!result, result });
      }
    }

    // Direct JSON Payload
    const email = body.email || body.invitee_email;
    const startTime = body.event_start_time || body.startTime || body.date;
    const time = body.time || '';
    const joinUrl = body.join_url || body.meetingLink;

    if (email) {
      const formatted = startTime ? formatCalendlyDate(startTime) : { date: '', time: '' };
      const dateToSave = formatted.date || startTime || '';
      const timeToSave = formatted.time || time || '';
      const result = await updateEnquiryByEmail(email, dateToSave, timeToSave, joinUrl);
      return NextResponse.json({ success: true, updated: !!result, result });
    }

    return NextResponse.json({ success: false, message: 'No valid email or event data found in request' }, { status: 400 });
  } catch (err) {
    console.error('[Calendly Webhook Error]:', err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Webhook handler failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const targetUrl =
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.gulfconnectconsultancy.com';

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('invitee_email') || searchParams.get('email');
    const startTime = searchParams.get('event_start_time') || searchParams.get('start_time');
    const joinUrl = searchParams.get('join_url') || searchParams.get('meeting_link');

    if (email && startTime) {
      const { date, time } = formatCalendlyDate(startTime);
      await updateEnquiryByEmail(email, date, time, joinUrl || undefined);
    }

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error('[Calendly GET Redirect Error]:', err);
    return NextResponse.redirect(targetUrl);
  }
}
