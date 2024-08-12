import { NextRequest, NextResponse } from 'next/server';
import cron from 'node-cron';
import { getConnectionPool } from '../../../lib/mysql';
import { revalidatePath } from 'next/cache';

let job: cron.ScheduledTask | null = null;

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'start') {
      if (job) {
        return NextResponse.json({ message: 'Job already running' });
      }

      job = cron.schedule('* * * * * *', async () => {
        const pool = await getConnectionPool();
        if (!pool) {
          throw new Error('Database connection failed');
        }

        const randomData = {
          carid: Math.floor(Math.random() * 1000),
          temperature: (Math.random() * 100).toFixed(2),
          humidity: (Math.random() * 100).toFixed(2),
          fuellevel: (Math.random() * 100).toFixed(2),
          pressure: (Math.random() * 100).toFixed(2),
          accelerometer: JSON.stringify({
            x: (Math.random() * 10).toFixed(2),
            y: (Math.random() * 10).toFixed(2),
            z: (Math.random() * 10).toFixed(2),
          }),
          gyroscope: JSON.stringify({
            x: (Math.random() * 10).toFixed(2),
            y: (Math.random() * 10).toFixed(2),
            z: (Math.random() * 10).toFixed(2),
          }),
          lightintensity: (Math.random() * 100).toFixed(2),
          timestamps: new Date(),
        };

        await pool.request().query(
          `INSERT INTO sensordata (carid, temperature, humidity, fuellevel, pressure, accelerometer, gyroscope, lightintensity, timestamps) 
           VALUES (${randomData.carid}, ${randomData.temperature}, ${randomData.humidity}, ${randomData.fuellevel}, ${randomData.pressure}, 
                   '${randomData.accelerometer}', '${randomData.gyroscope}', ${randomData.lightintensity}, '${randomData.timestamps.toISOString()}')`
        );

        // Revalidate the /analytics path
        revalidatePath('/analytics');
      });

      job.start();

      return NextResponse.json({ message: 'Job started' });
    } else if (action === 'stop') {
      if (job) {
        job.stop();
        job = null;
        return NextResponse.json({ message: 'Job stopped' });
      } else {
        return NextResponse.json({ message: 'No job is running' });
      }
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to handle job', error);
    return NextResponse.json({ error: 'Failed to handle job' }, { status: 500 });
  }
}
