import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { signInWithOauth } from '@/http/sign-in-with-oauth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const provider = searchParams.get('state')
  const code = searchParams.get('code')

  const parsedProvider = z.enum(['GITHUB', 'GOOGLE']).parse(provider)

  if (!parsedProvider) {
    return NextResponse.json(
      {
        message: 'OAuth provider was not found.',
      },
      {
        status: 400,
      },
    )
  }

  if (parsedProvider !== 'GITHUB' && parsedProvider !== 'GOOGLE') {
    return NextResponse.json(
      {
        message: 'OAuth provider not supported.',
      },
      {
        status: 400,
      },
    )
  }

  if (!code) {
    return NextResponse.json(
      {
        message: 'OAuth code was not found.',
      },
      {
        status: 400,
      },
    )
  }

  const { token } = await signInWithOauth({
    provider: parsedProvider,
    code,
  })

  if (!token) {
    return NextResponse.json(
      {
        message: 'OAuth token was not found.',
      },
      {
        status: 400,
      },
    )
  }

  cookies().set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
