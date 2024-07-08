import { ChevronDown, LogOut } from 'lucide-react'

import { auth } from '@/auth/auth'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function getInitials(input: string): string {
  let name: string

  if (input.includes('@')) {
    name = input.split('@')[0]
  } else {
    name = input
  }

  const words = name.trim().split(/\W+/)

  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')

  return initials.toUpperCase()
}

export async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.email}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>

        <Avatar className="size-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          <AvatarFallback>
            {getInitials(user.name || user.email)}
          </AvatarFallback>
        </Avatar>

        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" /> Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
