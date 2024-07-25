'use server'

import { revalidatePath } from 'next/cache'

import { acceptInvite } from '@/http/accept-invite'
import { rejectInvite } from '@/http/reject-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)

  revalidatePath('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)

  revalidatePath('organizations')
}
