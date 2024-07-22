import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SensorData {
  ID: number;
  carid: number;
  temperature: number;
  humidity: number;
  fuellevel: number;
  pressure: number;
  accelerometer: string;
  gyroscope: string;
  lightintensity: number;
}

export default function SensorDataTable() {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mysql');
        console.log('API Response:', response.data);
        setData(response.data.data); // Ensure this matches the structure of your API response
        if (response.data.error) {
          setError(response.data.error);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data.length) {
    return <div>No data found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Data</CardTitle>
        <CardDescription>
          Sensor: {process.env.GG_COM}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="m-5 whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Car ID</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Fuel Level</TableHead>
                <TableHead>Pressure</TableHead>
                <TableHead>Accelerometer</TableHead>
                <TableHead>Gyroscope</TableHead>
                <TableHead>Light Intensity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell>{item.ID}</TableCell>
                  <TableCell>{item.carid}</TableCell>
                  <TableCell>{item.temperature}</TableCell>
                  <TableCell>{item.humidity}</TableCell>
                  <TableCell>{item.fuellevel}</TableCell>
                  <TableCell>{item.pressure}</TableCell>
                  <TableCell>
                    {JSON.parse(item.accelerometer).x.toFixed(2)}, {JSON.parse(item.accelerometer).y.toFixed(2)}, {JSON.parse(item.accelerometer).z.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {JSON.parse(item.gyroscope).x.toFixed(2)}, {JSON.parse(item.gyroscope).y.toFixed(2)}, {JSON.parse(item.gyroscope).z.toFixed(2)}
                  </TableCell>
                  <TableCell>{item.lightintensity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
