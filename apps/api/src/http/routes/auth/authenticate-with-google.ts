import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOauthUrl = `https://oauth2.googleapis.com/token?code=${code}&client_id=${env.GOOGLE_OAUTH_CLIENT_ID}&client_secret=${env.GOOGLE_OAUTH_CLIENT_SECRET}&redirect_uri=${env.GOOGLE_OAUTH_REDIRECT_URL}&grant_type=authorization_code`

      const googleAccessTokenResponse = await fetch(googleOauthUrl, {
        method: 'POST',
      })

      const googleAccessTokenData = await googleAccessTokenResponse.json()
      console.log(googleAccessTokenData)

      const { access_token: googleAccessToken } = z
        .object({
          access_token: z.string(),
        })
        .parse(googleAccessTokenData)

      const googleUserResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      const googleUserData = await googleUserResponse.json()

      const {
        sub: googleId,
        picture: avatarUrl,
        name,
        email,
      } = z
        .object({
          sub: z.string(),
          picture: z.string().url(),
          name: z.string().nullable(),
          email: z.string().nullable(),
        })
        .parse(googleUserData)

      if (!email) {
        throw new BadRequestError(
          'Your google account must have an email to authenticate.',
        )
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
