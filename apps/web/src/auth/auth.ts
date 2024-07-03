import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export function isAuthenticated() {
  return cookies().has('token')
}

export async function auth() {
  const token = cookies().has('token')

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  redirect('api/auth/sign-out')
}
