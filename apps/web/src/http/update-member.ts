import { api } from './api-client'

type UpdateMemberRequest = {
  org: string
  memberId: string
  role: string
}

export async function updateMember({
  org,
  memberId,
  role,
}: UpdateMemberRequest) {
  await api.patch(`organizations/${org}/members/${memberId}`, {
    json: {
      role,
    },
  })
}
