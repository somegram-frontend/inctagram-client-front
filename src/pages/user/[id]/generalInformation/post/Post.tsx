import {
  BookmarkOutline,
  Button,
  Edit2Outline,
  Heart,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
  TextArea,
  TrashOutline,
} from '@honor-ui/inctagram-ui-kit'
import s from './post.module.scss'
import Image from 'next/image'
import defaultAva from '../../../../../shared/images/Mask group.jpg'
import { useState } from 'react'
import { ItemsType } from '@/api/posts-api.types'

type DescriptionCommentProps = {
  description?: string | null
  userName: string
  userAvatar: string
}

const DescriptionComment = ({ description, userName, userAvatar }: DescriptionCommentProps) => {
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

type Props = {
  setEditPost: (value: boolean) => void
  postData: ItemsType[]
}

export const Post = ({ setEditPost, postData }: Props) => {
  const [editMenu, setEditMenu] = useState(false)

  const postImage = postData[0].images[0]
  const postDescription = postData[0].description
  const userName = postData[0].postOwnerInfo.username
  const userAvatar = postData[0].postOwnerInfo.avatarUrl

  const onEditClickHandler = () => {
    setEditMenu(editMenu => !editMenu)
  }

  const buttonMenuClass = editMenu ? `${s.buttonMenu} ${s.visible}` : `${s.buttonMenu}`

  return (
    <div className={s.postContainer}>
      <Image src={postImage} alt="post image" width={490} height={560} className={s.postImage} />
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <Image
              src={userAvatar || defaultAva}
              alt="my avatar"
              width={40}
              height={40}
              className={s.descriptionAvatarImage}
            />
            <span className={s.descriptionUserName}>{userName}</span>
          </div>
          <button onClick={onEditClickHandler} className={s.editButton}>
            <MoreHorizontalOutline className={s.descriptionHeaderButton} />
          </button>
          <div className={buttonMenuClass}>
            <ul>
              <li onClick={() => setEditPost(true)}>
                <Edit2Outline />
                Edit Post
              </li>
              <li>
                <TrashOutline />
                Delete Post
              </li>
            </ul>
          </div>
        </div>
        <div className={`${s.descriptionCommentsContainer} ${s.wrapper}`}>
          {/* TODO add map */}
          <DescriptionComment
            description={postDescription}
            userName={userName}
            userAvatar={userAvatar}
          />
          <DescriptionComment userName="" userAvatar="" />
          <DescriptionComment userName="" userAvatar="" />
        </div>
        <div className={`${s.descriptionReactions} ${s.wrapper}`}>
          <div className={`${s.descriptionReactionsIconsContainer}`}>
            <div className={s.descriptionReactionsIcons}>
              <HeartOutline className={s.descriptionReactionsIcon} />
              <PaperPlaneOutline className={s.descriptionReactionsIcon} />
            </div>
            <BookmarkOutline className={s.descriptionReactionsIcon} />
          </div>
          <div className={s.descriptionReactionsAvatarsContainer}>
            <Image src={defaultAva} alt="" className={s.descriptionReactionsAvatarImage} />
            <Image src={defaultAva} alt="" className={s.descriptionReactionsAvatarImage} />
            <Image src={defaultAva} alt="" className={s.descriptionReactionsAvatarImage} />
            <span>
              2 243 <b>"Like"</b>
            </span>
          </div>
          <span className={s.date}>July 3, 2021</span>
        </div>
        <div className={`${s.descriptionFooter} ${s.wrapper}`}>
          <Button variant="borderless" as="span" className={s.descriptionFooterBtn}>
            Add a Comment...
          </Button>
          <Button variant="borderless" as="span">
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
