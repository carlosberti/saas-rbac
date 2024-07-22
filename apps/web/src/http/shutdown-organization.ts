import { api } from './api-client'

type ShutdownOrganizationRequest = {
  org: string
}

export async function ShutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
}
