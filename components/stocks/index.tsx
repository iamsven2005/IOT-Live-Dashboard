'use client'

import dynamic from 'next/dynamic'
import { RentalSkeleton } from './Rental-skeleton'
import { RentalsSkeleton } from './Rentals-skeleton'
import { EventsSkeleton } from './events-skeleton'

export { spinner } from './spinner'
export { BotCard, BotMessage, SystemMessage } from './message'

const Rental = dynamic(() => import('./Rental').then(mod => mod.Rental), {
  ssr: false,
  loading: () => <RentalSkeleton />
})

const Purchase = dynamic(
  () => import('./Rental-purchase').then(mod => mod.Purchase),
  {
    ssr: false,
    loading: () => (
      <div className="h-[375px] rounded-xl border bg-zinc-950 p-4 text-green-400 sm:h-[314px]" />
    )
  }
)

const Rentals = dynamic(() => import('./Rentals').then(mod => mod.Rentals), {
  ssr: false,
  loading: () => <RentalsSkeleton />
})

const Events = dynamic(() => import('./events').then(mod => mod.Events), {
  ssr: false,
  loading: () => <EventsSkeleton />
})

export { Rental, Purchase, Rentals, Events }
