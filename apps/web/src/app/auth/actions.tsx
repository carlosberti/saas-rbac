'use server'

import { redirect } from 'next/navigation'

export async function signInWithGithub() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInUrl.searchParams.set('client_id', 'Ov23likyP2X8u3guAjRF')
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback?provider=GITHUB',
  )
  githubSignInUrl.searchParams.set('scope', 'user')
  githubSignInUrl.searchParams.set('state', 'GITHUB')

  redirect(githubSignInUrl.toString())
}

export async function signInWithGoogle() {
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${'999505674448-qgd36gm105kp8lke5eqi0r4vdemhsosj.apps.googleusercontent.com'}&redirect_uri=${'http://localhost:3000/api/auth/callback'}&scope=openid%20email%20profile&access_type=offline&state=GOOGLE`

  redirect(googleSignInUrl.toString())
}
