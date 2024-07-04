import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userForEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userForEmail) {
        throw new BadRequestError('Invalid credentials.')
      }

      if (userForEmail.passwordHash === null) {
        throw new BadRequestError(
          'User does not have a password, use social login instead.',
        )
      }

      const isPasswordValid = await compare(password, userForEmail.passwordHash)

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials.')
      }

      const token = await reply.jwtSign(
        { sub: userForEmail.id },
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
