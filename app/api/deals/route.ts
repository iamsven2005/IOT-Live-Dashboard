// /app/api/deals/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const deals = await db.deals.findMany();
    return NextResponse.json(deals, { status: 200, headers: { 'Cache-Control': 's-maxage=10, stale-while-revalidate' } });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
