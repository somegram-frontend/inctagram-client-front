import {
  BookmarkOutline,
  Button,
  Edit2Outline,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
  TrashOutline,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import s from './post.module.scss'
import Image from 'next/image'
import defaultAva from '../../../../../shared/images/Mask group.jpg'
import { useState } from 'react'
import { ItemsType } from '@/api/posts-api.types'
import { PostComment } from './PostComment'
import PhotoSlider from '@/components/dialogAddUserPost/photoSlider'

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

  const images = postData[0].images

  const onEditClickHandler = () => {
    setEditMenu(editMenu => !editMenu)
  }

  const buttonMenuClass = editMenu ? `${s.buttonMenu} ${s.visible}` : `${s.buttonMenu}`

  return (
    <div className={s.postContainer}>
      <PhotoSlider
        image={images}
        className={s.postImage}
        dotClass={s.postDots}
        imgClass={s.image}
      />
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
            <Typography variant="bold_text16">{userName}</Typography>
          </div>
          <button onClick={onEditClickHandler}>
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
          <PostComment description={postDescription} userName={userName} userAvatar={userAvatar} />
          <PostComment userName="" userAvatar="" />
          <PostComment userName="" userAvatar="" />
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
              2 243 <b>&quot;Like&quot;</b>
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
