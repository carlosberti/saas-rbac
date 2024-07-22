import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrganization } from '@/auth/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ShutdownOrganization } from '@/http/shutdown-organization'

export function ShutdownOrganizationButton() {
  const currentOrg = getCurrentOrganization()
  async function shutdownOrganizationAction() {
    'use server'

    await ShutdownOrganization({ org: currentOrg! })

    redirect('/')
  }

  return (
    <form id="shutdown-organization" action={shutdownOrganizationAction}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-56">
            <XCircle className="mr-2 size-4" />
            Shutdown organization
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure that you want to delete{' '}
              <span className="whitespace-nowrap text-destructive">
                "{currentOrg}"
              </span>{' '}
              organization?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" form="shutdown-organization">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}
