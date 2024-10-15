import { Heart, HeartOutline, MoreHorizontalOutline } from '@honor-ui/inctagram-ui-kit'
import s from './post.module.scss'

export const Post = () => {
  return (
    <div className={s.postContainer}>
      <img src="" alt="" className={s.postImage} />
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionUserName}>URLProfile</span>
          </div>
          <button>
            <MoreHorizontalOutline className={s.descriptionHeaderButton} />
          </button>
        </div>
        <div className={`${s.descriptionCommentsContainer} ${s.wrapper}`}>
          <div className={s.descriptionCommentContainer}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionComment}>
              <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
            <div className={s.descriptionCommentIconContainer}>
              <HeartOutline className={s.descriptionCommentIcon} />
            </div>
          </div>
          <div className={s.descriptionCommentContainer}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionComment}>
              <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
            <div className={s.descriptionCommentIconContainer}>
              <Heart className={`${s.descriptionCommentIcon} ${s.iconActive}`} />
            </div>
          </div>
          <div className={s.descriptionCommentContainer}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionComment}>
              <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
            <img src="" alt="" className={s.descriptionCommentIcon} />
          </div>
        </div>
        <div className={s.descriptionReactions}>
          <div className={`${s.descriptionReactionsIconsContainer} ${s.wrapper}`}>
            <div className={s.descriptionReactionsIcons}>
              <img src="" alt="" className={s.descriptionReactionsIcon} />
              <img src="" alt="" className={s.descriptionReactionsIcon} />
            </div>
            <img src="" alt="" className={s.descriptionReactionsIcon} />
          </div>
          <div className={`${s.descriptionReactionsAvatarsContainer} ${s.wrapper}`}>
            <img src="" alt="" className={s.descriptionReactionsAvatarImage} />
            <img src="" alt="" className={s.descriptionReactionsAvatarImage} />
            <img src="" alt="" className={s.descriptionReactionsAvatarImage} />
            <span>
              2 243 <b>"Like"</b>
            </span>
          </div>
          <span className={`${s.date} ${s.wrapper}`}>July 3, 2021</span>
        </div>
        <div className={`${s.descriptionFooter} ${s.wrapper}`}>
          <span>Add a Comment...</span>
          <button>Publish</button>
        </div>
      </div>
    </div>
  )
}
