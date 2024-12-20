import { api } from './api-client'

type GetOrganizationsResponse = {
  organizations: Array<{
    slug: string
    id: string
    name: string
    avatarUrl: string | null
  }>
}

export async function getOrganizations() {
  const result = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationsResponse>()

  return result
}
