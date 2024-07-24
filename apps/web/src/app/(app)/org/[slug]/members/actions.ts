'use server'

import { type Role, roleSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrganization } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
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

const inviteSchema = z.object({
  email: z.string().email('Invalid email address.'),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, role } = result.data

  try {
    const currentOrg = getCurrentOrganization()

    await createInvite({
      org: currentOrg!,
      email,
      role,
    })

    revalidateTag(`${currentOrg}/invites`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite',
    errors: null,
  }
}
