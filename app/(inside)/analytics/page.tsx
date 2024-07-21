"use client"
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveLine } from "@nivo/line"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from "./actions"
import Sensors from "./Sensors"
import Revenue from "./Revenue"
import AllUsers from "./User"
import TotalCars from "./Total"
import  Bookings from "./bookings"
import LineChartComponent from "./Chat"
import Brands from "./Brands"
import Deals from "./Deals"
import Link from "next/link"
export default function Component() {
  const [messages, setMessages] = useState<CoreMessage[]>([     { role: 'assistant', content: 'Welcome! How can I assist you with car rental today?' }
]);
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <TotalCars/>

        <Card>
          <CardHeader>
            <CardTitle>Under Maintenance</CardTitle>
            <WrenchIcon className="size-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">5</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Being serviced</p>
            <Link href="/faults">
            View More
            </Link>
          </CardContent>
        </Card>

        <Revenue/>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Rental Data</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Inventory</CardTitle>
            <Sensors />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Reg. No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Toyota</TableCell>
                  <TableCell>Camry</TableCell>
                  <TableCell>2020</TableCell>
                  <TableCell>ABC123</TableCell>
                  <TableCell>
                    <Badge variant="outline">Available</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Honda</TableCell>
                  <TableCell>Civic</TableCell>
                  <TableCell>2018</TableCell>
                  <TableCell>DEF456</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Rented</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ford</TableCell>
                  <TableCell>Mustang</TableCell>
                  <TableCell>2021</TableCell>
                  <TableCell>GHI789</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Maintenance</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Deals/>

        <Bookings/>

        <Brands/>

        <AllUsers/>

        <Card>
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content as string}
        </div>
      ))}

      <form
        action={async () => {
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ];

          setMessages(newMessages);
          setInput('');

          const result = await continueConversation(newMessages);
          setData(result.data);

          for await (const content of readStreamableValue(result.message)) {
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
          </CardContent>
            
        </Card>
      </div>
    </>
  )
}

function CarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}


function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}





function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}