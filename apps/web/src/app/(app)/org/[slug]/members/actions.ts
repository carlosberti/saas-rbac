'use server'

import type { Role } from '@saas/auth'
import { revalidateTag } from 'next/cache'

import { getCurrentOrganization } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

export async function removeMemberAction(memberId: string) {
  const currentOrg = getCurrentOrganization()

  await removeMember({
    org: currentOrg!,
    memberId,
  })
  revalidateTag(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const currentOrg = getCurrentOrganization()

  await updateMember({
    org: currentOrg!,
    memberId,
    role,
  })
  revalidateTag(`${currentOrg}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrganization()

  await revokeInvite({
    org: currentOrg!,
    inviteId,
  })
  revalidateTag(`${currentOrg}/members`)
}
