'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function continueConversation(messages: CoreMessage[]) {
  'use server';
  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });
  const data = 'the current best rental car is Ford150 , what is the best course of action for a car rental compant?'
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, data };
}