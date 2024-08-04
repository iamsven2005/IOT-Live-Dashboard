import { clearChats, getChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { cache } from 'react'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import Header from '@/app/(inside)/header'
import Link from 'next/link'
import { Button } from './ui/button'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)
  const session = (await auth()) as Session;
  
  if (!session) {
    return redirect("/");
  }
  const admin = await db.user.findFirst({
    where:{
      email: session.user.email
    }
  })
  const isAdmin = admin?.role === "admin"
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isAdmin  ? <Header/> : <div className='gap-2'><Link href="/bookings" className='m-2'><Button>View Bookings</Button></Link><Link href="/support" className='m-2'><Button>Request for help</Button></Link>
        </div>}
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ThemeToggle />
        <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
      </div>
    </div>
  )
}
