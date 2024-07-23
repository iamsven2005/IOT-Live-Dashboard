"use client"
import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from "./actions"
import Sensors from "./Sensors"
import Revenue from "./Revenue"
import AllUsers from "./User"
import TotalCars from "./Total"
import  Bookings from "./bookings"
import Brands from "./Brands"
import Deals from "./Deals"
import Link from "next/link"
import { Chart } from "./Sensor"
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
          <Chart/>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        
            <Sensors />
         

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