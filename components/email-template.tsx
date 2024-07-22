import * as React from 'react';

interface EmailTemplateProps {
  to: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  to,
  message,
}) => (
  <div>
    <h1>Attention, {to}!</h1>
    <p>{message}</p>
  </div>
);
