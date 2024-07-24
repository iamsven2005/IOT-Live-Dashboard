'use server'

import { signIn } from '@/auth'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'
import { kv } from '@vercel/kv'
import { getUser } from '@/app/(inside)/login/actions'
import { AuthError } from 'next-auth'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@/lib/db'

export async function createUser(
  email: string,
  hashedPassword: string,
  salt: string,
  role: string
) {
  const existingUser = await getUser(email)

  if (existingUser) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      salt,
      role
    }

    await kv.hmset(`user:${email}`, user)
    const userdb = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        salt,
        role,
        assignedTask: "No task",
      },
    })
    return {
      type: 'success',
      resultCode: ResultCode.UserCreated
    }
  }
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    .safeParse({
      email,
      password
    })

  if (parsedCredentials.success) {
    const salt = crypto.randomUUID()
    const role = "user"
    const encoder = new TextEncoder()
    const saltedPassword = encoder.encode(password + salt)
    const hashedPasswordBuffer = await crypto.subtle.digest(
      'SHA-256',
      saltedPassword
    )
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)
    try {
      const result = await createUser(email, hashedPassword, salt, role)

      if (result.resultCode === ResultCode.UserCreated) {
        await signIn('credentials', {
          email,
          password,
          redirect: false
        })
      }
      const sendEmail = async (to: string, subject: string, message: string) => {
        try {
          await fetch('/api/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, message }),
          });
        } catch (error) {
          console.error('Failed to send email:', error);
        }
      };
    
      await sendEmail(email, 'Account Created', 'Thank you for signing up with autozone');
      return result
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              type: 'error',
              resultCode: ResultCode.InvalidCredentials
            }
          default:
            return {
              type: 'error',
              resultCode: ResultCode.UnknownError
            }
        }
      } else {
        return {
          type: 'error',
          resultCode: ResultCode.UnknownError
        }
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidCredentials
    }
  }
}
