import { api } from './api-client'

type RemoveMemberRequest = {
  org: string
  memberId: string
}

export async function removeMember({ org, memberId }: RemoveMemberRequest) {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
