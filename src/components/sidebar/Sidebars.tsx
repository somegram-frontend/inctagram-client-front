import s from './sidebars.module.scss'
import { Typography } from '@honor-ui/inctagram-ui-kit'

import {
  BookmarkOutline,
  HomeOutline,
  MessageCircleOutline,
  PersonOutline,
  PlusSquareOutline,
  Search,
  TrendingUp,
} from '@honor-ui/inctagram-ui-kit'

import LogOut from '@/pages/auth/logOut'
import { useRouter } from 'next/router'
import { useMeQuery } from '@/api/auth-api'
import DialogAddUserPost from '../dialogAddUserPost'

export const Sidebars = () => {
  const router = useRouter()

  const { data } = useMeQuery()

  const handleProfileSettingClick = () => {
    router.push({
      pathname: '/user/[id]/generalInformation',
      query: { id: data?.userId },
    })
  }

  const handleHomeClick = () => {
    router.push({
      pathname: '/user/[id]/',
      query: { id: data?.userId },
    })
  }

  return (
    <div className={s.box}>
      <div className={s.content}>
        <ul>
          <Typography as={'li'} variant={'medium_text14'} onClick={handleHomeClick}>
            <HomeOutline /> Home
          </Typography>
          <Typography as={'li'} variant={'medium_text14'}>
            <DialogAddUserPost />
          </Typography>
          <Typography as={'li'} variant={'medium_text14'} onClick={handleProfileSettingClick}>
            <PersonOutline /> My Profile
          </Typography>
          <Typography as={'li'} variant={'medium_text14'}>
            <MessageCircleOutline /> Messenger
          </Typography>
          <Typography as={'li'} variant={'medium_text14'} className={s.searchSpace}>
            <Search /> Search
          </Typography>
          <Typography as={'li'} variant={'medium_text14'}>
            <TrendingUp /> Statistics
          </Typography>
          <Typography as={'li'} variant={'medium_text14'}>
            <BookmarkOutline /> Favorites
          </Typography>
          <Typography as={'li'} variant={'medium_text14'}>
            <LogOut email={data?.email} />
          </Typography>
        </ul>
      </div>
    </div>
  )
}
