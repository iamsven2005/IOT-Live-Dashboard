"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Parser } from 'json2csv';

export default function Revenue() {
  const [data, setData] = useState<{ users: any[] }>({ users: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch brand data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const sendEmail = async (to: string, subject: string, message: string) => {
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const banUser = async (userId: string, email: string) => {
    try {
      await axios.post('/api/banUser', { userId });
      setData((prevData) => ({
        users: prevData.users.map((user) =>
          user.id === userId ? { ...user, role: 'ban' } : user
        ),
      }));
      toast.success('User banned successfully');
      await sendEmail(email, 'Account Banned', 'Your account has been banned.');
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    }
  };

  const unbanUser = async (userId: string, email: string) => {
    try {
      await axios.post('/api/unbanUser', { userId });
      setData((prevData) => ({
        users: prevData.users.map((user) =>
          user.id === userId ? { ...user, role: 'user' } : user
        ),
      }));
      toast.success('User unbanned successfully');
      await sendEmail(email, 'Account Unbanned', 'Your account has been unbanned.');
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    }
  };

  const exportToCSV = () => {
    const fields = ['email', 'assignedTask', 'id', 'role'];
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(data.users);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      link.click();
    } catch (err) {
      console.error('Failed to export data as CSV:', err);
      toast.error('Failed to export data as CSV');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Failed to load data.</div>;
  }

  const filteredUsers = data.users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between">
          <Input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-4"
          />
          <Button onClick={exportToCSV}>Export as CSV</Button>
        </div>
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
            {filteredUsers.map((user) => (
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
                    <Button variant="secondary" onClick={() => unbanUser(user.id, user.email)}>
                      Unban
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={() => banUser(user.id, user.email)}>
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
