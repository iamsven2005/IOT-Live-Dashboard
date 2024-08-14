import {
  Button,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
interface EmailTemplateProps {
  to: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  to,
  message,
}) => (
   <Section style={section}>
   <Text style={text}>
     Hey <strong> {to}</strong>!
   </Text>
   <Text style={text}>
   {message}
   </Text>

   <Button style={button} href="https://iot-live-dashboard.vercel.app/">Visit Autozone</Button>
 </Section>
);
const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

