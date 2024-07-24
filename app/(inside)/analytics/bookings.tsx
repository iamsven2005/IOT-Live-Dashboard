"use client";
import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from "@/components/ui/input";

const fetchBookings = async () => {
  try {
    const response = await fetch('/api/bookings');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.bookings;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
};

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const getBookings = async () => {
      const fetchedBookings = await fetchBookings();
      setBookings(fetchedBookings);
    };

    getBookings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.Car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.startDate} - ${booking.endDate}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search bookings"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4"
        />
        <ScrollArea className="h-72 w-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.Name}</TableCell>
                  <TableCell>{booking.Car.title}</TableCell>
                  <TableCell>{`${booking.startDate} - ${booking.endDate}`}</TableCell>
                  <TableCell>
                    <Badge variant={booking.pay === 'true' ? 'outline' : 'secondary'}>
                      {booking.pay}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
