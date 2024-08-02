"use client";
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

const FeatureRequestForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [suggest, setSuggest] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState<boolean | undefined>(undefined); // Correctly typed as boolean or undefined

  // Regular expression for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Validate email format and set emailError correctly as a boolean
    setEmailError(!emailRegex.test(emailValue)); // Sets emailError to true if email is invalid, false if valid
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) {
      setMessage('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, suggest }),
      });

      if (response.ok) {
        setMessage('Feature request submitted successfully!');
        setEmail('');
        setSuggest('');
      } else {
        setMessage('Failed to submit feature request.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while submitting your request.');
    }
  };

  return (
    <Card className="p-4">
      <CardTitle className="mb-4 text-lg font-bold">Submit a Feature Request</CardTitle>
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className={`w-full p-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
          />
          {emailError && <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Suggestion:</label>
          <Textarea
            value={suggest}
            onChange={(e) => setSuggest(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          ></Textarea>
        </div>
        <button
          type="submit"
          disabled={!email || emailError || !suggest}
          className={`px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none ${emailError ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
      </form>
    </Card>
  );
};

export default FeatureRequestForm;
