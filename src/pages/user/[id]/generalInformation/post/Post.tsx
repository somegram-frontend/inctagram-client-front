import {
  BookmarkOutline,
  Button,
  Heart,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
} from '@honor-ui/inctagram-ui-kit'
import s from './post.module.scss'
import Image from 'next/image'
import defaultAva from '../../../../../shared/images/Mask group.jpg'
import { useState } from 'react'

const DescriptionComment = () => {
  const [click, setClick] = useState(false)
  return (
    <div className={s.descriptionCommentContainer}>
      <Image src={defaultAva} alt="" className={s.descriptionAvatarImage} />
      <span className={s.descriptionComment}>
        <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
      <div className={s.descriptionCommentIconContainer} onClick={() => setClick(!click)}>
        {click ? (
          <Heart className={`${s.descriptionCommentIcon} ${s.iconActive}`} />
        ) : (
          <HeartOutline className={s.descriptionCommentIcon} />
        )}
      </div>
    </div>
  )
}

export const Post = () => {
  return (
    <div className={s.postContainer}>
      <img src="" alt="" className={s.postImage} />
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <Image src={defaultAva} alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionUserName}>URLProfile</span>
          </div>
          <button>
            <MoreHorizontalOutline className={s.descriptionHeaderButton} />
          </button>
        </div>
        <div className={`${s.descriptionCommentsContainer} ${s.wrapper}`}>
          {/* TODO add map */}
          <DescriptionComment />
          <DescriptionComment />
          <DescriptionComment />
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
          {/* <span>Add a Comment...</span> */}
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
