import Image from 'next/image'

import logoIcon from '@/assets/logo-icon.svg'

import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="iterms-center flex gap-3">
        <Image src={logoIcon} alt="logo" className="size-6 dark:invert" />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
