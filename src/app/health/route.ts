import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, route: '/health', now: new Date().toISOString() }, { headers: { 'cache-control': 'no-store' } });
}
