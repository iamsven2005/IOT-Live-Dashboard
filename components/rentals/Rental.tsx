interface Rental {
  symbol: string
  price: number
  brand: string
  name: string
  image: string
  comment: string
  commenter: string
  description: string
  carplate: string
}

export function Rental({ props: { symbol, price, brand, image, name, comment, commenter, description, carplate } }: { props: Rental }) {
  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="text-lg text-zinc-300">{symbol}</div>
      <div className="text-3xl font-bold">${price} / Day</div>
      <img src={image} className="rouned-xl"></img>
      <div>
        {brand} : {name}
      </div>
      <div>
        Car plate: {carplate}
      </div>
      <div className="card-body">
        <div>
          About the car
        </div>
        <div>
          {description}
        </div>
      </div>
      <div>
        Feedback: {comment}
      </div>
      <div>
        ~{commenter}
      </div>
    </div>
  )
}
