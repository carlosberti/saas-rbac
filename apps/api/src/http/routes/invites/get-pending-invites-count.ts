import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getPendingInvitesCount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites-count',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get user pending invites count',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              pendingInvitesCount: z.number(),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            email: true,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        const pendingInvitesCount = await prisma.invite.count({
          where: { email: user.email },
        })

        return { pendingInvitesCount }
      },
    )
}
