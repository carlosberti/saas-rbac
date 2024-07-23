'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentOrganization } from '@/auth/auth'
import { RemoveMember } from '@/http/remove-member'

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrganization()

  await RemoveMember({
    org: currentOrg!,
    memberId,
  })
  revalidateTag(`${currentOrg}/members`)
}
