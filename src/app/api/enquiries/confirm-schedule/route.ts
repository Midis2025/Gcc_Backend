import { NextResponse } from 'next/server';
import { db } from '@/config/db';
import { InvestorModel } from '@/repositories/investor.repository';
import { CompanyModel } from '@/repositories/company.repository';

export async function POST(req: Request) {
  try {
    const { email, startTime, status } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const dateObj = startTime ? new Date(startTime) : null;
    const preferredDate = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined;
    const preferredTime = dateObj ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined;

    const updateFields: Record<string, unknown> = {
      status: status || 'REVIEWED',
    };
    if (preferredDate) updateFields.preferredDate = preferredDate;
    if (preferredTime) updateFields.preferredTime = preferredTime;

    let updatedDoc = null;

    try {
      await db.connect();

      // Attempt to update matching investor enquiry first
      updatedDoc = await InvestorModel.findOneAndUpdate(
        { email: new RegExp(`^${cleanEmail}$`, 'i') },
        { $set: updateFields },
        { sort: { createdAt: -1 }, new: true }
      );

      // If not found in investor, check company enquiry
      if (!updatedDoc) {
        updatedDoc = await CompanyModel.findOneAndUpdate(
          { email: new RegExp(`^${cleanEmail}$`, 'i') },
          { $set: updateFields },
          { sort: { createdAt: -1 }, new: true }
        );
      }
    } catch (dbErr) {
      console.warn('[ConfirmScheduleAPI] DB update failed or running in-memory:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting schedule confirmed successfully',
      updated: !!updatedDoc,
    });
  } catch (error) {
    console.error('[ConfirmScheduleAPI] Error confirming scheduled meeting:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
