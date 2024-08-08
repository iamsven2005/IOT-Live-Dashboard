"use client";
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

const EmailForm: React.FC = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message }),
      });

      if (response.ok) {
        setStatusMessage('Email sent successfully!');
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setStatusMessage('Failed to send email.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('An error occurred while sending your email.');
    }
  };

  return (
    <Card className="p-4 mt-4">
      <CardTitle className="mb-4 text-lg font-bold">Send Email to User</CardTitle>
      {statusMessage && <p className="mb-4 text-sm text-gray-700">{statusMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">To:</label>
          <Input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Subject:</label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Message:</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          ></Textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </form>
    </Card>
  );
};

export default EmailForm;
