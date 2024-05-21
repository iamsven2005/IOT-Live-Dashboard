"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import qs from "query-string"
const Search =() =>{
    const searchParams = useSearchParams()
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) =>{
        setValue(e.target.value)
    }
    const pathname = usePathname()
    const router = useRouter()
    const title = searchParams.get("title")
    const [value, setValue]= useState(title || "")

    useEffect(()=>{
        const query = {
            title: value
        }
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {skipNull: true, skipEmptyString: true})
        router.push(url)
    }, [value, router])
    if(pathname != "/") return null
    return(
        <div className="m-5 p-5">
            <Input value={value} onChange={onChange} placeholder="search" className="pl-10 bg-primary/10"/>
        </div>
    )
}
export default Search