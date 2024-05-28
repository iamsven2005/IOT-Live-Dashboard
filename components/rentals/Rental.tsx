interface Rental {
  symbol: string
  price: number
  brand: string
  name: string
  image: string
  id: string
  email: string
}

export async function Rental({ props: { symbol, price, brand, image, name, id, email } }: { props: Rental })

{
  return (
      <iframe src={`https://iot-live-dashboard.vercel.app//ViewCar/${id}`} className="w-full rounded-xl border bg-zinc-950 p-4  m-5 h-96"
      />
  )
}
