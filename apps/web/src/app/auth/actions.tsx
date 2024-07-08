'use server'

import { env } from '@saas/env'
import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_REDIRECT_URL,
  )
  githubSignInUrl.searchParams.set('scope', 'user')
  githubSignInUrl.searchParams.set('state', 'GITHUB')

  redirect(githubSignInUrl.toString())
}

export async function signInWithGoogle() {
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${env.GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${env.GOOGLE_OAUTH_REDIRECT_URL}&scope=openid%20email%20profile&access_type=offline&state=GOOGLE`

  redirect(googleSignInUrl.toString())
}
