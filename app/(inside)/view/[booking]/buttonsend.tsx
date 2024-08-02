"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  email: string | undefined; // Changed from `null` to `undefined`
  id: string;
}

const Send = ({ email, id }: Props) => {
  const [isSending, setIsSending] = useState(false); // To track email sending state

  // Email details
  const to = email || ""; // Default to an empty string to handle undefined
  const subject = "Payment Details";
  const message = `Link to invoice https://iot-live-dashboard.vercel.app/view/${id}`;

  // Send email function
  const sendEmail = async (to: string, subject: string, message: string) => {
    setIsSending(true); // Set sending state
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      toast.success("Email sent successfully!"); // Display success message
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again."); // Display error message
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  // Wrapper function for onClick
  const handleClick = () => {
    if (email) {
      // Check if email is defined and not empty
      sendEmail(to, subject, message);
    } else {
      console.error("Email is null or invalid.");
      alert("Email is invalid or not provided."); // Display error message
    }
  };

  return (
    <Button onClick={handleClick} disabled={isSending || !email}>
      {isSending ? "Sending..." : "Send Email"}
    </Button>
  );
};

export default Send;
