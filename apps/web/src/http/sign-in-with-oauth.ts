import { api } from './api-client'

type signInRequest = {
  code: string
}

type signInResponse = {
  token: string
}

async function signInWithGithub({ code }: signInRequest) {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<signInResponse>()

  return result
}

async function signInWithGoogle({ code }: signInRequest) {
  const result = await api
    .post('sessions/google', {
      json: {
        code,
      },
    })
    .json<signInResponse>()

  return result
}

type SignInWithOauthRequest = {
  provider: 'GITHUB' | 'GOOGLE'
  code: string
}

export async function signInWithOauth({
  provider,
  code,
}: SignInWithOauthRequest) {
  switch (provider) {
    case 'GITHUB':
      return await signInWithGithub({ code })
    case 'GOOGLE':
      return await signInWithGoogle({ code })
    default:
      throw new Error('OAuth provider not supported.')
  }
}
