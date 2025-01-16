import { useState } from 'react'
import Image from 'next/image'
import defaultAva from '@/assets/images/Mask group.jpg'
import { Heart, HeartOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import s from '../../post.module.scss'

type CommentProps = {
  description?: string | null
  userName: string
  userAvatar: string
}

const PostComment = ({ description, userName, userAvatar }: CommentProps) => {
  const [click, setClick] = useState(false)

  return (
    <div className={s.descriptionCommentContainer}>
      {description ? (
        <>
          <Image
            src={userAvatar || defaultAva}
            alt="user avatar"
            width={40}
            height={40}
            className={s.descriptionAvatarImage}
          />
          <Typography variant="regular_text14" className={s.descriptionComment}>
            <b>{userName}</b> {description}
          </Typography>
        </>
      ) : (
        <Typography variant="regular_text14">This post has no description...yet.</Typography>
      )}
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

export default PostComment
