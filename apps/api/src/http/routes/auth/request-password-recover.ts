import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request password recover',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userForEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userForEmail) {
        return reply.status(201).send() // always return success, the user shouldn't know if the email exists
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userForEmail.id,
        },
      })

      console.log('Recover password token: ', code) // add recovery email

      return reply.status(201).send()
    },
  )
}
