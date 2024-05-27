"use client"
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

export default function Sensors() {
  const [sensorsData, setSensorsData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSensors');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        
        setSensorsData(data);
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sensors Data</h1>
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
    </div>
  );
}

