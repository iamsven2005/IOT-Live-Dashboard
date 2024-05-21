import Image from "next/image"

interface Rental {
  symbol: string
  price: number
  brand: string
  name: string
  image: string
}

export function Rental({ props: { symbol, price, brand, image, name } }: { props: Rental }) {
  return (
    <div className="rounded-xl border bg-zinc-950 p-4 ">
      <div className="text-lg text-zinc-300">{symbol}</div>
      <div className="text-3xl font-bold text-green-400">${price} / Day</div>
      <div className="container">
      <img src={image} alt={name}className="rouned-xl"></img>
      <div>
        {brand} : {name}
      </div>
      <div className="card-body">
        <div>
          About the car
        </div>

      </div>
      </div>
      
    </div>
  )
}
