import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../../actions'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Car Rental Service'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  if(!session){
    return redirect("/login")
  }
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
