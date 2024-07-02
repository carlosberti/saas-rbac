import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function SignInUp() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name">Name</label>
        <Input name="name" id="name" />
      </div>
      <div className="space-y-1">
        <label htmlFor="email">E-mail</label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <label htmlFor="password">Password</label>
        <Input name="password" type="password" id="password" />
      </div>
      <div className="space-y-1">
        <label htmlFor="confirm-password">Confirm password</label>
        <Input name="confirm-password" type="password" id="confirm-password" />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={googleIcon} alt="Google icon" className="mr-2 size-4" />
        Sign up with Google
      </Button>
      <Button type="submit" variant="outline" className="w-full">
        <Image
          src={githubIcon}
          alt="Github icon"
          className="mr-2 size-4 dark:invert"
        />
        Sign up with Github
      </Button>
    </form>
  )
}
