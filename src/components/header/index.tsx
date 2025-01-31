import s from './header.module.scss'
import {Button, FlagRussia, FlagUnitedKingdom, Select} from '@honor-ui/inctagram-ui-kit'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useAppDispatch, useAppSelector} from "@/store";
import {setLanguage} from "@/appRoot/app/appSlice";
import {selectorLanguage} from "@/appRoot/app";
import {Language} from "@/appRoot/app/lib";

type Props = {
  isAuth: boolean
}

export const Header = ({isAuth}: Props) => {
  const router = useRouter()
  const language = useAppSelector(selectorLanguage)
  const dispatch = useAppDispatch()

  const options = [
    {
      label: (
        <div className={s.flagContainer}>
          <FlagUnitedKingdom/> &nbsp; <span> English</span>
        </div>
      ),
      value: 'en',
    },
    {
      label: (
        <div className={s.flagContainer}>
          <FlagRussia/>
          &nbsp;
          <span>Russian</span>
        </div>
      ),
      value: 'ru',
    },
  ]

  const handleChangeLanguage = (value: Language) => {
    dispatch(setLanguage(value))
  }

  return (
    <header className={s.header}>
      <Link href="/" className={s.logo}>
        Somegram
      </Link>
      <div className={s.register}>
        <Select
          className={s.select}
          options={options}
          value={language}
          placeholder={
            <div className={s.flagContainer}>
              <FlagUnitedKingdom/> &nbsp; <span> English</span>
            </div>
          }
          onValueChange={(value) => handleChangeLanguage(value as Language)}
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
