import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: 'user' },
    });
    return NextResponse.json({ message: 'User unbanned successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unban user' }, { status: 500 });
  }
}
