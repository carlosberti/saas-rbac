import { api } from './api-client'

type GetPendingInvitesCountResponse = {
  pendingInvitesCount: number
}

export async function getPendingInvitesCount() {
  const result = await api
    .get('pending-invites-count')
    .json<GetPendingInvitesCountResponse>()

  return result
}
