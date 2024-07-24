"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DataPoint {
  timestamp: string;
  desktop: number | null;
  mobile: number | null;
  other: number | null;
}

const fetchData = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/mysql');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

const transformTemperatureData = (data: any[]): DataPoint[] => {
  return data.map((item: any) => ({
    timestamp: new Date(item.timestamps).toLocaleTimeString(),
    desktop: item.carid === 1 ? item.temperature : null,
    mobile: item.carid === 2 ? item.temperature : null,
    other: item.carid === 3 ? item.temperature : null,
  }));
};

const transformHumidityData = (data: any[]): DataPoint[] => {
  return data.map((item: any) => ({
    timestamp: new Date(item.timestamps).toLocaleTimeString(),
    desktop: item.carid === 1 ? item.humidity : null,
    mobile: item.carid === 2 ? item.humidity : null,
    other: item.carid === 3 ? item.humidity : null,
  }));
};

export function Chart() {
  const [temperatureData, setTemperatureData] = useState<DataPoint[]>([]);
  const [humidityData, setHumidityData] = useState<DataPoint[]>([]);
  const [temperatureThreshold, setTemperatureThreshold] = useState<number>(40);
  const [humidityThreshold, setHumidityThreshold] = useState<number>(100);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      const transformedTemperatureData = transformTemperatureData(data);
      const transformedHumidityData = transformHumidityData(data);
      setTemperatureData(transformedTemperatureData);
      setHumidityData(transformedHumidityData);
    };

    getData();
  }, []);

  useEffect(() => {
    const checkThreshold = (data: DataPoint[], threshold: number, type: string) => {
      data.forEach(point => {
        if ((point.desktop !== null && point.desktop > threshold) ||
            (point.mobile !== null && point.mobile > threshold) ||
            (point.other !== null && point.other > threshold)) {
          toast.error(`${type} value exceeded the threshold of ${threshold}`);
        }
      });
    };

    checkThreshold(temperatureData, temperatureThreshold, 'Temperature');
    checkThreshold(humidityData, humidityThreshold, 'Humidity');
  }, [temperatureData, temperatureThreshold, humidityData, humidityThreshold]);

  const chartConfig = {
    desktop: {
      label: "Car 1",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Car 2",
      color: "hsl(var(--chart-2))",
    },
    other: {
      label: "Car 3",
      color: "hsl(var(--chart-3))",
    },
  };

  const handleTemperatureThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemperatureThreshold(Number(event.target.value));
  };

  const handleHumidityThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHumidityThreshold(Number(event.target.value));
  };

  return (
      <Tabs defaultValue="temperature" className="w-full">
        <TabsList>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
        </TabsList>
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Area Chart - Temperature Data</CardTitle>
              <CardDescription>Showing temperature for different cars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="temperature-threshold" className="block text-sm font-medium text-gray-700">
                  Temperature Threshold Value
                </label>
                <input
                  type="number"
                  id="temperature-threshold"
                  value={temperatureThreshold}
                  onChange={handleTemperatureThresholdChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={temperatureData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="other"
                    type="monotone"
                    fill={temperatureData.some(data => data.other !== null && data.other > temperatureThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-3))"}
                    fillOpacity={0.1}
                    stroke="hsl(var(--chart-3))"
                    connectNulls
                  />
                  <Area
                    dataKey="mobile"
                    type="monotone"
                    fill={temperatureData.some(data => data.mobile !== null && data.mobile > temperatureThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-2))"}
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-2))"
                    connectNulls
                  />
                  <Area
                    dataKey="desktop"
                    type="monotone"
                    fill={temperatureData.some(data => data.desktop !== null && data.desktop > temperatureThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-1))"}
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-1))"
                    connectNulls
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="size-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Temperature data from various cars
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="humidity">
          <Card>
            <CardHeader>
              <CardTitle>Area Chart - Humidity Data</CardTitle>
              <CardDescription>Showing humidity for different cars</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="humidity-threshold" className="block text-sm font-medium text-gray-700">
                  Humidity Threshold Value
                </label>
                <input
                  type="number"
                  id="humidity-threshold"
                  value={humidityThreshold}
                  onChange={handleHumidityThresholdChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={humidityData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="other"
                    type="monotone"
                    fill={humidityData.some(data => data.other !== null && data.other > humidityThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-3))"}
                    fillOpacity={0.1}
                    stroke="hsl(var(--chart-3))"
                    connectNulls
                  />
                  <Area
                    dataKey="mobile"
                    type="monotone"
                    fill={humidityData.some(data => data.mobile !== null && data.mobile > humidityThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-2))"}
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-2))"
                    connectNulls
                  />
                  <Area
                    dataKey="desktop"
                    type="monotone"
                    fill={humidityData.some(data => data.desktop !== null && data.desktop > humidityThreshold) ? "hsl(var(--highlight))" : "hsl(var(--chart-1))"}
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-1))"
                    connectNulls
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Humidity data from various cars
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
  );
}
