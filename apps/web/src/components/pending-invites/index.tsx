'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getPendingInvites } from '@/http/get-pending-invites'
import { getPendingInvitesCount } from '@/http/get-pending-invites-count'
import { queryClient } from '@/lib/react-query'

import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  const { data: pendingInvites, isLoading: isLoadingPendingInvitesCount } =
    useQuery({
      queryKey: ['pending-invites-count'],
      queryFn: getPendingInvitesCount,
    })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({
      queryKey: ['pending-invites'],
    })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({
      queryKey: ['pending-invites'],
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          {!isLoadingPendingInvitesCount &&
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            pendingInvites?.pendingInvitesCount! > 0 && (
              <Badge
                className="absolute -right-1 -top-1 rounded-full font-bold"
                variant="destructive"
              >
                {pendingInvites?.pendingInvitesCount}
              </Badge>
            )}
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending invites ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You don't have any pending invites
          </p>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            {data?.invites.map((invite) => (
              <div className="space-y-2" key={invite.id}>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {invite.author?.name ?? 'Someone'}
                  </span>{' '}
                  invited you to join{' '}
                  <span className="font-medium text-foreground">
                    {invite.organization.name}
                  </span>
                  . <span>{dayjs(invite.createdAt).fromNow()}</span>
                </p>

                <div className="flex gap-1">
                  <Button
                    onClick={() => handleAcceptInvite(invite.id)}
                    size="xs"
                    variant="outline"
                  >
                    <Check className="mr-1.5 size-3" />
                    Accept
                  </Button>

                  <Button
                    onClick={() => handleRejectInvite(invite.id)}
                    size="xs"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    <X className="mr-1.5 size-3" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
