import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from 'react';

export default function Revenue() {
  const [data, setData] = useState<{ users: any[] }>({ users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.users.length) {
    return <div>Failed to load data.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.assignedTask}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "user" ? "outline" : "secondary"}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
