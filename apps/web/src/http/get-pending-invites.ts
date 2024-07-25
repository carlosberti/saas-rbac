import type { Role } from '@saas/auth'

import { api } from './api-client'

type GetPendingInvitesResponse = {
  invites: Array<{
    organization: {
      name: string
    }
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }>
}

export async function getPendingInvites() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const result = await api
    .get(`pending-invites`)
    .json<GetPendingInvitesResponse>()

  return result
}
