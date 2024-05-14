import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi
export async function POST(req: Request){
    const session = (await auth()) as Session
    if (!session.user) return new NextResponse("Unauthorized", {status: 401})
    const {imageKey} = await req.json()
try{
    const res = await utapi.deleteFiles(imageKey)
    return NextResponse.json(res)
}catch(error){
    console.log("error:", error)
    return new NextResponse("Server Error" , {status: 500})
}
}