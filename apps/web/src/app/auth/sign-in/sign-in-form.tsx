'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword } from './actions'

type FieldsDefinition = {
  email: string
  password: string
}

export function SignInForm() {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState<FieldsDefinition>(signInWithEmailAndPassword, () =>
      router.push('/'),
    )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <label htmlFor="email">E-mail</label>
        <Input name="email" id="email" />

        {errors?.email && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password">Password</label>
        <Input name="password" type="password" id="password" />

        {errors?.password && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign in with e-mail'
        )}
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={googleIcon} alt="Google icon" className="mr-2 size-4" />
        Sign in with Google
      </Button>
      <Button type="submit" variant="outline" className="w-full">
        <Image
          src={githubIcon}
          alt="Github icon"
          className="mr-2 size-4 dark:invert"
        />
        Sign in with Github
      </Button>
    </form>
  )
}
