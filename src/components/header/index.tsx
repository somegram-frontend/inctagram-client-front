import s from './header.module.scss'
import { Button, Select } from '@honor-ui/inctagram-ui-kit'
import { FlagRussia, FlagUnitedKingdom } from '@honor-ui/inctagram-ui-kit'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  isAuth: boolean
}

export const Header = ({ isAuth }: Props) => {
  const router = useRouter()

  const options = [
    {
      label: (
        <div className={s.flagContainer}>
          <FlagUnitedKingdom /> &nbsp; <span> English</span>
        </div>
      ),
      value: 'value1',
    },
    {
      label: (
        <div className={s.flagContainer}>
          <FlagRussia />
          &nbsp;
          <span>Russian</span>
        </div>
      ),
      value: 'value2',
    },
  ]

  return (
    <header className={s.header}>
      <div className={s.logo}>Somegram</div>
      <div className={s.register}>
        <Select
          className={s.select}
          options={options}
          placeholder={
            <div className={s.flagContainer}>
              <FlagUnitedKingdom /> &nbsp; <span> English</span>
            </div>
          }
        />
        {!isAuth && !router.pathname.includes('/auth/') && (
          <div className={s.buttons}>
            <Link href="/auth/signUp">
              <Button variant={'primary'}>Sign up</Button>
            </Link>
            <Link href="/auth/signIn">
              <Button variant={'primary'}>Log In</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
