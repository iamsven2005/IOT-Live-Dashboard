//delete ids fro sensordata

import { NextRequest, NextResponse } from 'next/server';
import { getConnectionPool } from '../../../lib/mysql';

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnectionPool();
    if (!pool) {
      throw new Error('Database connection failed');
    }

    // Execute the delete query for IDs between 145 and 490
    await pool.request().query('DELETE FROM sensordata WHERE ID >= 145 AND ID <= 490');

    return NextResponse.json({ message: 'Records with ID 145 to 490 have been deleted.' });
  } catch (error) {
    console.error('Failed to delete records', error);
    return NextResponse.json({ error: 'Failed to delete records' }, { status: 500 });
  }
}
