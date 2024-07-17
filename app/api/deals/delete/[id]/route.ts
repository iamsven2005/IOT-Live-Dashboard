import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const { name, price, description } = await req.json();

  try {
    const updatedDeal = await db.deals.update({
      where: { id },
      data: { name, price, description },
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update the deal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  try {
    await db.deals.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete the deal' }, { status: 500 });
  }
}
