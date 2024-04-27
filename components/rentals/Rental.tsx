interface Rental {
  symbol: string
  price: number
  delta: number
}

export function Rental({ props: { symbol, price, delta } }: { props: Rental }) {
  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="text-lg text-zinc-300">{symbol}</div>
      <div className="text-3xl font-bold">${price} / Day</div>
      
    </div>
  )
}
