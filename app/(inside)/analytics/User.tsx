import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

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

  const banUser = async (userId: string) => {
    try {
      await axios.post('/api/banUser', { userId });
      setData((prevData) => ({
        users: prevData.users.map((user) =>
          user.id === userId ? { ...user, role: 'ban' } : user
        ),
      }));
      toast.success('User banned successfully');
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      await axios.post('/api/unbanUser', { userId });
      setData((prevData) => ({
        users: prevData.users.map((user) =>
          user.id === userId ? { ...user, role: 'user' } : user
        ),
      }));
      toast.success('User unbanned successfully');
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    }
  };

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
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  {user.role === "ban" ? (
                    <Button variant="secondary" onClick={() => unbanUser(user.id)}>
                      Unban
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={() => banUser(user.id)}>
                      Ban
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
