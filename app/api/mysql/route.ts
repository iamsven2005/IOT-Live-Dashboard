import { NextRequest, NextResponse } from 'next/server';
import { getConnectionPool } from '../../../lib/mysql';

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnectionPool();
    if (!pool) {
      throw new Error('Database connection failed');
    }

    const result = await pool.request().query('SELECT * FROM sensordata'); // Adjust the query according to your table name
    return NextResponse.json({ data: result.recordset });
  } catch (error) {
    console.error('Database query failed', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
