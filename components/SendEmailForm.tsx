"use client"
import React, { useState } from 'react';

const SendEmailButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: 'iamsven2005@gmail.com' }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Email sent successfully!');
      } else {
        setError(result.error || 'Failed to send email.');
      }
    } catch (err) {
      setError('An error occurred while sending the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default SendEmailButton;
