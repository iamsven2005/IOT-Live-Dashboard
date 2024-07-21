import { db } from "@/lib/db";
import Board from "./Board";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";

const Page = async() => {
    const board = await db.faults.findMany({include:{
      faultDetails: true
    }})
    const session = (await auth()) as Session;
    if (!session) {
      return redirect("/login");
    }
    return ( <Board board={board}/> );
}
 
export default Page;