import s from './sidebars.module.scss'
import { Typography } from '@honor-ui/inctagram-ui-kit'

import {
  // BookmarkOutline,
  HomeOutline,
  MessageCircleOutline,
  PersonOutline,
  Search,
  // TrendingUp,
} from '@honor-ui/inctagram-ui-kit'

import LogOut from '@/pages/auth/logOut'
import { useRouter } from 'next/router'
import DialogAddUserPost from '@/pages/user/[id]/post/addPost'
import { useState } from 'react'
import { useTranslation } from '@/shared/hooks'
import clsx from 'clsx'
import { useAppSelector } from '@/store'
import { fetchIsAuth } from '@/api/auth/auth.selectors'
import { useMeQuery } from '@/api/auth/auth-api'

export const Sidebars = () => {
  const [isActiveCreate, setIsActiveCreate] = useState(false)
  const { data } = useMeQuery()

  const isAuth = useAppSelector(fetchIsAuth)
  const t = useTranslation()

  const router = useRouter()
  const handleProfileClick = () => {
    router.push({
      pathname: '/user/[id]/',
      query: { id: data?.userId },
    })
  }

  const handleHomeClick = () => {
    router.push('/')
  }
  if (!isAuth) {
    return null
  } else {
    return (
      <div className={s.box}>
        <div className={s.content}>
          <ul>
            <Typography
              as={'li'}
              variant={'medium_text14'}
              onClick={handleHomeClick}
              className={!router.pathname.split('/')[1] && !isActiveCreate ? s.active : ''}
            >
              <HomeOutline /> {t.home}
            </Typography>
            <Typography
              as={'li'}
              variant={'medium_text14'}
              className={isActiveCreate ? s.active : ''}
            >
              <DialogAddUserPost setIsActiveCreate={setIsActiveCreate} />
            </Typography>
            <Typography
              as={'li'}
              variant={'medium_text14'}
              onClick={handleProfileClick}
              className={router.pathname.includes('/user/') && !isActiveCreate ? s.active : ''}
            >
              <PersonOutline /> {t.profile.title}
            </Typography>
            <Typography
              as={'li'}
              onClick={() => {
                router.push('/messenger')
              }}
              variant={'medium_text14'}
              className={router.pathname.includes('/messenger') && !isActiveCreate ? s.active : ''}
            >
              <MessageCircleOutline /> {t.messenger}
            </Typography>
            <Typography
              as={'li'}
              variant={'medium_text14'}
              className={clsx(
                s.searchSpace,
                router.pathname.includes('/search') && !isActiveCreate ? s.active : '',
              )}
              onClick={() => {
                router.push('/search')
              }}
            >
              <Search /> {t.search}
            </Typography>
            {/*<Typography as={'li'} variant={'medium_text14'}>*/}
            {/*  <TrendingUp /> {t.statistics}*/}
            {/*</Typography>*/}
            {/*<Typography as={'li'} variant={'medium_text14'}>*/}
            {/*  <BookmarkOutline /> {t.favorites}*/}
            {/*</Typography>*/}
            <Typography as={'li'} variant={'medium_text14'}>
              <LogOut email={data?.email} />
            </Typography>
          </ul>
        </div>
      </div>
    )
  }
}
