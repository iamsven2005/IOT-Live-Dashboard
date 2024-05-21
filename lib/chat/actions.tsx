
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Rental,
  Purchase
} from '@/components/rentals'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/rentals/events-skeleton'
import { Events } from '@/components/rentals/events'
import { RentalsSkeleton } from '@/components/rentals/Rentals-skeleton'
import { Rentals } from '@/components/rentals/Rentals'
import { RentalSkeleton } from '@/components/rentals/Rental-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/rentals/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import { db } from '../db'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} Days of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showRentalPurchase',
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} Days of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode
  const cars = await db.car.findMany({
    select: {
      title: true,
      rental: true,
      image: true,
      brand: true,
      id: true,
    }
  })
  const cararray = JSON.stringify(cars);
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
You are a Car Rental conversation bot and you can help users buy Rentals, step by step.
You and the user can discuss Rental prices and the user can adjust the amount of time for  Car Rentals they want to buy, or place an order, in the UI.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of Prius = 100]" means that an interface of the Rental price of Prius is shown to the user.
- "[User has changed the amount of Prius to 10]" means that the user has changed the amount days to rent a Prius to 10 in the UI.

If the user requests purchasing a Rental, call \`show_Rental_purchase_ui\` to show the purchase UI.
If the user just wants the price, call \`show_Rental_price\` to show the price.
If you want to show trending Rentals, call \`list_Rentals\`.
If you want to show other trending Rentals, call \`list_Rentals\`.
If you want to show events, call \`get_events\`.
If the user wants to sell Rental, or complete another impossible task, respond that you are a 
demo and cannot do that.

Current cars available are ${cararray}

Besides that, you can also chat with users and do some calculations if needed.`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    functions: {
      listRentals: {
        description: 'List all cars that are avaliable as well as their respective image url',
        parameters: z.object({
          rentals: z.array(
            z.object({
              symbol: z.string().describe('The brand of the Rental'),
              price: z.number().describe('The price of the Rental'),
              name: z.string().describe('The name of the rental'),
              image: z.string().describe('The image url of the rental')
            })
          )
        }),
        render: async function* ({ rentals }) {
          yield (
            <BotCard>
              <RentalsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'listRentals',
                content: JSON.stringify(rentals)
              }
            ]
          })

          return (
            <BotCard>
              <Rentals props={rentals} />
            </BotCard>
          )
        }
      },
      showRentalPrice: {
        description:
          'Get the current Rental price of a given Car Rental or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the Rental or currency. e.g. BMW/Honda/SGD.'
            ),
          price: z.number().describe('The price of the Rental.'),
          brand: z.string().describe('The brand of the Rental'),
          image: z.string().describe('The image of the Rental'),
          name: z.string().describe('The name of the Rental'),
        }),
        render: async function* ({ symbol, price, brand, image, name }) {
          yield (
            <BotCard>
              <RentalSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showRentalPrice',
                content: JSON.stringify({ symbol, price, image, name, brand })
              }
            ]
          })

          return (
            <BotCard>
              <Rental props={{ symbol, price, image, name, brand }} />
            </BotCard>
          )
        }
      },
      showRentalPurchase: {
        description:
          'Show price and the UI to purchase a Car Rental or currency. Use this if the user wants to purchase a Car Rental or currency.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the Rental or currency. e.g. BMW/Mazda/USD.'
            ),
          price: z.number().describe('The price of the Rental.'),
          numberOfDays: z
            .number()
            .describe(
              'The **number of Days** for a Rental or currency to purchase. Can be optional if the user did not specify it.'
            )
        }),
        render: async function* ({ symbol, price, numberOfDays = 100 }) {
          if (numberOfDays <= 0 || numberOfDays > 1000) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showRentalPurchase',
                content: JSON.stringify({
                  symbol,
                  price,
                  numberOfDays
                })
              }
            ]
          })

          return (
            <BotCard>
              <Purchase
                props={{
                  numberOfDays,
                  symbol,
                  price: +price,
                  status: 'requires_action'
                }}
              />
            </BotCard>
          )
        }
      },
      getEvents: {
        description:
          'List funny imaginary events between user highlighted dates that describe Rental activity.',
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the event, in ISO-8601 format'),
              headline: z.string().describe('The headline of the event'),
              description: z.string().describe('The description of the event')
            })
          )
        }),
        render: async function* ({ events }) {
          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'getEvents',
                content: JSON.stringify(events)
              }
            ]
          })

          return (
            <BotCard>
              <Events props={events} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listRentals' ? (
            <BotCard>
              <Rentals props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showRentalPrice' ? (
            <BotCard>
              <Rental props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showRentalPurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'getEvents' ? (
            <BotCard>
              <Events props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
