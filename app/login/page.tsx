import { auth } from '@/auth'
import LoginForm from '@/components/login-form'
import { db } from '@/lib/db'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = (await auth()) as Session
  const users = await db.user.findMany({
    select: {
      username: true,
      role: true,
      id: true,
    }
  })

  if (session) {
    redirect('/')
  }

  return (
    <main className="flex flex-col p-4">
      {users.map((user, index) => (
        <div key={user.id}>
          {user.username}{user.role}
        </div>
      ))}
      <LoginForm />
    </main>
  )
}
