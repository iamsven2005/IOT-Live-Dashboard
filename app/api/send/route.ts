import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/email-template';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message } = await req.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient email address is required.' }, { status: 400 });
    }

    const emailContent = EmailTemplate({ to, message });

    const { data, error } = await resend.emails.send({
      from: 'support@bihance.app',
      to: [to],
      subject: subject || "No Subject",
      react: emailContent as React.ReactElement,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
