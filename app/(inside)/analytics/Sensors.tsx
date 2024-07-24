"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

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
  timestamps: Date
}

export default function SensorDataTable() {
  const [data, setData] = useState<SensorData[]>([]);
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mysql');
        console.log('API Response:', response.data);
        setData(response.data.data); // Ensure this matches the structure of your API response
        setFilteredData(response.data.data);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => 
        item.ID.toString().includes(e.target.value) ||
        item.carid.toString().includes(e.target.value) ||
        item.temperature.toString().includes(e.target.value) ||
        item.humidity.toString().includes(e.target.value) ||
        item.fuellevel.toString().includes(e.target.value) ||
        item.pressure.toString().includes(e.target.value) ||
        item.lightintensity.toString().includes(e.target.value) ||
        item.accelerometer.includes(e.target.value) ||
        item.gyroscope.includes(e.target.value) ||
        item.timestamps.toString().includes(e.target.value)
      ));
    }
  };

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
        <CardDescription className='w-96 break-all'>
          Sensor: Endpoint=sb://ihsuprodsgres005dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=em3GGuJtNXVXErB3bzavU0NAwy7+yzyg1PUPUbLhxBw=;EntityPath=iothub-ehub-it3681-00-25073661-9ede3c7483
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4"
        />
        <ScrollArea className="m-5 whitespace-nowrap rounded-md border h-96">
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
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
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
                  <TableCell>{item.timestamps.toString()}</TableCell>
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
