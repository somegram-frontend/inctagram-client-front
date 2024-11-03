import { useState } from 'react'
import Image from 'next/image'
import defaultAva from '@/assets/images/Mask group.jpg'
import { Heart, HeartOutline } from '@honor-ui/inctagram-ui-kit'
import s from '../../post.module.scss'

type CommentProps = {
  description?: string | null
  userName: string
  userAvatar: string
}

export const PostComment = ({ description, userName, userAvatar }: CommentProps) => {
  const [click, setClick] = useState(false)

  return (
    <div className={s.descriptionCommentContainer}>
      <Image
        src={userAvatar || defaultAva}
        alt="user avatar"
        width={40}
        height={40}
        className={s.descriptionAvatarImage}
      />
      <span className={s.descriptionComment}>
        <b>{userName || 'URLProfiele'}</b>{' '}
        {description ||
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
      </span>
      {!userName && (
        <div className={s.descriptionCommentIconContainer}>
          {click ? (
            <Heart
              className={`${s.descriptionCommentIcon} ${s.iconActive}`}
              onClick={() => setClick(false)}
            />
          ) : (
            <HeartOutline className={s.descriptionCommentIcon} onClick={() => setClick(true)} />
          )}
        </div>
      )}
    </div>
  )
}
