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

const DescriptionComment = () => {
  const [click, setClick] = useState(false)
  return (
    <div className={s.descriptionCommentContainer}>
      <Image src={defaultAva} alt="" className={s.descriptionAvatarImage} />
      <span className={s.descriptionComment}>
        <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
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
    </div>
  )
}

type Props = {
  setEditPost: (value: boolean) => void
}

export const Post = ({ setEditPost }: Props) => {
  const [editMenu, setEditMenu] = useState(false)

  const onEditClickHandler = () => {
    setEditMenu(editMenu => !editMenu)
  }

  const buttonMenuClass = editMenu ? `${s.buttonMenu} ${s.visible}` : `${s.buttonMenu}`

  return (
    <div className={s.postContainer}>
      <Image src="" alt="post image" className={s.postImage} />
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <Image src={defaultAva} alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionUserName}>URLProfile</span>
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
