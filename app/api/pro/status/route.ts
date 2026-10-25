import { NextRequest, NextResponse } from 'next/server';
import { applyProResult, getProFromRequest } from '@/lib/pro-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET — the server's view of this browser's Pro status (from the signed httpOnly cookie). */
export async function GET(request: NextRequest) {
  const result = await getProFromRequest(request);
  const res = NextResponse.json({ isPro: result.isPro });
  res.headers.set('Cache-Control', 'no-store');
  applyProResult(res, result);
  return res;
}
