'use client'

import { AlertTriangle, Loader2, UserPlus } from 'lucide-react'
import { requestFormReset } from 'react-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'

import { createInviteAction } from './actions'

type FieldsDefinition = {
  email: string
}

export function CreateInviteForm() {
  // const { slug: orgSlug } = useParams<{ slug: string }>()
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState<FieldsDefinition>(createInviteAction, (form) =>
      requestFormReset(form),
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Input name="email" id="email" placeholder="doe@example.com" />

          <Select name="role" defaultValue="MEMBER">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="relative" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="absolute m-auto size-4 animate-spin" />
                <div className="invisible flex">
                  <UserPlus className="mr-2 size-4" />
                  Invite user
                </div>
              </>
            ) : (
              <>
                <UserPlus className="mr-2 size-4" />
                Invite user
              </>
            )}
          </Button>
        </div>

        {errors?.email && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>
    </form>
  )
}
