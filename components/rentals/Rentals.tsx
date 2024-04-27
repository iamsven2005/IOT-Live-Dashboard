'use client'

import { useActions, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/actions'

interface Rental {
  symbol: string
  price: number
  delta: number
}

export function Rentals({ props: Rentals }: { props: Rental[] }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
        {Rentals.map(Rental => (
          <button
            key={Rental.symbol}
            className="flex cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-700 sm:w-52"
            onClick={async () => {
              const response = await submitUserMessage(`View ${Rental.symbol}`)
              setMessages(currentMessages => [...currentMessages, response])
            }}
          >
            <div className="flex flex-col">
              <div className="bold uppercase text-zinc-300">{Rental.symbol}</div>
              <div className="bold uppercase text-zinc-300">${Rental.price} / Day</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
