"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import qs from "query-string"
import { Brand } from "@prisma/client"

interface Props {
    brands: Brand[]
}

const Search = ({ brands }: Props) => {
    const searchParams = useSearchParams()
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }
    const pathname = usePathname()
    const router = useRouter()
    const title = searchParams.get("title")
    const initialBrand = searchParams.get("brand") || ""
    const [value, setValue] = useState(title || "")
    const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand)

    useEffect(() => {
        const query = {
            title: value,
            brand: selectedBrand || undefined,
        }
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true, skipEmptyString: true })
        router.push(url)
    }, [value, selectedBrand, router])

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand)
    }

    if (pathname != "/") return null
    return (
        <div className="m-5 p-5">
            <Input value={value} onChange={onChange} placeholder="search" className="pl-10 bg-primary/10" />
            <div className="mt-4">
                {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                        <input
                            type="radio"
                            id={`brand-${brand.id}`}
                            name="brand"
                            checked={selectedBrand === brand.name}
                            onChange={() => handleBrandChange(brand.name)}
                            className="mr-2"
                        />
                        <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search
