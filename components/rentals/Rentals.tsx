'use client'

import { useActions, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/actions'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card, CardContent, CardTitle } from '../ui/card'

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
<Carousel className="w-full max-w-[50%]">      
<CarouselContent className='gap-5'>
        {Rentals.map(Rental => (
          <CarouselItem key={Rental.id} className=" basis-1/3 p-2 m-2 w-1/3">
          <button
            key={Rental.symbol}
            className="flex cursor-pointer flex-row gap-2 rounded-lg bg-zinc-800 p-2 text-left hover:bg-zinc-700"
            onClick={async () => {
              const response = await submitUserMessage(`View ${Rental.symbol}`)
              setMessages((currentMessages: any) => [...currentMessages, response])
            }}
          >
            <Card>
          <CardContent className="flex flex-col">
              <CardTitle className="bold uppercase text-zinc-300">{Rental.name}</CardTitle>
              <CardContent className="bold uppercase text-zinc-300">${Rental.price} / Day</CardContent>
                <Image src={Rental.image} alt={Rental.name} className='w-full aspect-[4/3] overflow-hidden rounded-xl object-cover object-center' width="100" height="50"></Image>
                </CardContent>
              </Card>
          </button>
          </CarouselItem>

        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
