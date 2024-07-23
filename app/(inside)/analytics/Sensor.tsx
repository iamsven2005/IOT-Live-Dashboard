"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const fetchData = async () => {
  try {
    const response = await fetch('/api/mysql');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

const transformTemperatureData = (data: any) => {
  return data.map((item: any) => ({
    timestamp: new Date(item.timestamps).toLocaleTimeString(),
    desktop: item.carid === 1 ? item.temperature : null,
    mobile: item.carid === 2 ? item.temperature : null,
    other: item.carid === 3 ? item.temperature : null,
  }));
};

const transformHumidityData = (data: any) => {
  return data.map((item: any) => ({
    timestamp: new Date(item.timestamps).toLocaleTimeString(),
    desktop: item.carid === 1 ? item.humidity : null,
    mobile: item.carid === 2 ? item.humidity : null,
    other: item.carid === 3 ? item.humidity : null,
  }));
};

export function Chart() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);

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
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.1}
                  stroke="hsl(var(--chart-3))"
                  connectNulls
                />
                <Area
                  dataKey="mobile"
                  type="monotone"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-2))"
                  connectNulls
                />
                <Area
                  dataKey="desktop"
                  type="monotone"
                  fill="hsl(var(--chart-1))"
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
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.1}
                  stroke="hsl(var(--chart-3))"
                  connectNulls
                />
                <Area
                  dataKey="mobile"
                  type="monotone"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-2))"
                  connectNulls
                />
                <Area
                  dataKey="desktop"
                  type="monotone"
                  fill="hsl(var(--chart-1))"
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
