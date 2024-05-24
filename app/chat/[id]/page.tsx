//@ts-ignore
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`);

  }

  const userId = session.user.id; 

  if (!userId) {
    redirect('/');
  }

  const chat = await getChat(params.id, userId);

  if (!chat) {
    redirect('/');
  }

  if (chat.userId !== userId) {
    notFound();
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={await getMissingKeys()}
      />
    </AI>
  )
}
