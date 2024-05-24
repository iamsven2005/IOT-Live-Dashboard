import Image from "next/image"
import Link from "next/link"

interface Rental {
  symbol: string
  price: number
  brand: string
  name: string
  image: string
  id: string
}

export function Rental({ props: { symbol, price, brand, image, name, id } }: { props: Rental }) {
  return (
    <div className="rounded-xl border bg-zinc-950 p-4 ">
      <div className="text-lg text-zinc-300">{symbol}</div>
      <div className="text-3xl font-bold text-green-400">${price} / Day</div>
      <div className="container">
      <Image src={image} alt={name}className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full" width="550" height="310"></Image>
      <div className="text-zinc-300">
        {brand} : {name}
      </div>
      <div className="card-body text-zinc-300">
      <Link href={`/Car/${id}`}>View Info</Link>

      </div>
      </div>
      
    </div>
  )
}
