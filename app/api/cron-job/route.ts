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

        // Randomly select a carId between 1, 2, and 3
        const carid = Math.floor(Math.random() * 3) + 1;

        const randomData = {
          carid,
          temperature: parseFloat((Math.random() * 20 + 20).toFixed(2)), // Temperature between 20 and 40 degrees
          humidity: parseFloat((Math.random() * 20 + 60).toFixed(2)), // Humidity between 60 and 80%
          fuellevel: parseFloat((Math.random() * 100).toFixed(2)),
          pressure: parseFloat((Math.random() * 3000).toFixed(2)), // Pressure with a realistic range up to 3000
          accelerometer: JSON.stringify({
            x: parseFloat((Math.random() * 2 - 1).toFixed(6)),
            y: parseFloat((Math.random() * 2 - 1).toFixed(6)),
            z: parseFloat((Math.random() * 2 - 1).toFixed(6)),
          }),
          gyroscope: JSON.stringify({
            x: parseFloat((Math.random() * 360 - 180).toFixed(6)),
            y: parseFloat((Math.random() * 360 - 180).toFixed(6)),
            z: parseFloat((Math.random() * 360 - 180).toFixed(6)),
          }),
          lightintensity: parseFloat((Math.random() * 10000).toFixed(2)),
          timestamps: new Date().toISOString(),
        };

        await pool.request().query(
          `INSERT INTO sensordata (carid, temperature, humidity, fuellevel, pressure, accelerometer, gyroscope, lightintensity, timestamps) 
           VALUES (${randomData.carid}, ${randomData.temperature}, ${randomData.humidity}, ${randomData.fuellevel}, ${randomData.pressure}, 
                   '${randomData.accelerometer}', '${randomData.gyroscope}', ${randomData.lightintensity}, '${randomData.timestamps}')`
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
