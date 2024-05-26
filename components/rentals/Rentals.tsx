'use client'

import { useActions, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/actions'
import Image from 'next/image'

interface Rental {
  symbol: string
  price: number
  name: string
  image: string
  id: string
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
              setMessages((currentMessages: any) => [...currentMessages, response])
            }}
          >
            <div className="flex flex-col">
              <div className="bold uppercase text-zinc-300">{Rental.symbol}</div>
              <div className="bold uppercase text-zinc-300">${Rental.price} / Day</div>
                <Image src={Rental.image} alt={Rental.name} className='w-full aspect-[4/3] overflow-hidden rounded-xl object-cover object-center' width="100" height="50"></Image>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
