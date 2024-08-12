"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreMessage } from "ai";
import { useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

const AIdash = () => {
  const [messages, setMessages] = useState<CoreMessage[]>([
    { role: "assistant", content: "Welcome! How can I assist you with car rental today?" },
  ]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];

    setMessages(newMessages);
    setInput("");

    const result = await continueConversation(newMessages);
    setData(result.data);

    for await (const content of readStreamableValue(result.message)) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-96 max-w-md p-2 mx-auto stretch">
          {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          {messages.map((m, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content as string}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIdash;
