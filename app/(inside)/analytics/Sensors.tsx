"use client"
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type SensorData = {
  partitionId: string;
  data: {
    temperature: number;
    humidity: number;
    fuelLevel: number;
    pressure: number;
    accelerometer: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
    lightIntensity: number;
  };
};

function generateRandomSensorData() {
  return {
    temperature: parseFloat((Math.random() * 30 + 10).toFixed(2)), // Random temperature between 10 and 40
    humidity: parseFloat((Math.random() * 50 + 30).toFixed(2)),    // Random humidity between 30 and 80
    fuelLevel: parseFloat((Math.random() * 50 + 50).toFixed(2)),   // Random fuel level between 50 and 100
    pressure: parseFloat((Math.random() * 40 + 980).toFixed(2)),   // Random pressure between 980 and 1020
    accelerometer: {
      x: parseFloat((Math.random() * 2 - 1).toFixed(2)),           // Random accelerometer x between -1 and 1
      y: parseFloat((Math.random() * 2 - 1).toFixed(2)),           // Random accelerometer y between -1 and 1
      z: parseFloat((Math.random() * 2 - 1).toFixed(2)),           // Random accelerometer z between -1 and 1
    },
    gyroscope: {
      x: parseFloat((Math.random() * 360).toFixed(2)),             // Random gyroscope x between 0 and 360
      y: parseFloat((Math.random() * 360).toFixed(2)),             // Random gyroscope y between 0 and 360
      z: parseFloat((Math.random() * 360).toFixed(2)),             // Random gyroscope z between 0 and 360
    },
    lightIntensity: parseFloat((Math.random() * 1000).toFixed(2)), // Random light intensity between 0 and 1000
  };
}

export default function Sensors() {
  const [sensorsData, setSensorsData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setOffline(false);
    try {
      const response = await fetch('/api/getSensors');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      console.log(data);
      if (data.length === 0) {
        setOffline(true);
      }
      setSensorsData(data);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sendData = async () => {
      const randomSensorData = generateRandomSensorData();
      try {
        const response = await fetch('/api/sendData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(randomSensorData),
        });

        if (!response.ok) {
          throw new Error('Failed to send sensor data');
        }
      } catch (error) {
        console.error('Failed to send sensor data:', error);
      }
    };

    const sendAndFetchData = async () => {
      await sendData();
      await fetchData();
    };

    sendAndFetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sensors Data</h1>
      <Button onClick={fetchData}>Refresh Data</Button>
      {offline ? (
        <p>The device is offline.</p>
      ) : (
        <ul>
          {sensorsData.map((sensor, index) => (
            <li key={index}>
              <h2>Partition: {sensor.partitionId}</h2>
              <p>Temperature: {sensor.data.temperature}</p>
              <p>Humidity: {sensor.data.humidity}</p>
              <p>Fuel Level: {sensor.data.fuelLevel}</p>
              <p>Pressure: {sensor.data.pressure}</p>
              <p>Accelerometer: x: {sensor.data.accelerometer.x}, y: {sensor.data.accelerometer.y}, z: {sensor.data.accelerometer.z}</p>
              <p>Gyroscope: x: {sensor.data.gyroscope.x}, y: {sensor.data.gyroscope.y}, z: {sensor.data.gyroscope.z}</p>
              <p>Light Intensity: {sensor.data.lightIntensity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
