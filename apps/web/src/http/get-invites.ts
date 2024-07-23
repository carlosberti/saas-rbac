import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetInvitesResponse = {
  invites: Array<{
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }>
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return result
}
