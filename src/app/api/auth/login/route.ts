import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Authentication is managed via Clerk' }, { status: 400 });
}
