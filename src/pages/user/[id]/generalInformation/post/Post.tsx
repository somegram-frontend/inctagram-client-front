import s from './post.module.scss'

export const Post = () => {
  return (
    <div className={s.postContainer}>
      <img src="" alt="" className={s.postImage} />
      <div className={s.descriptionContainer}>
        <div className={s.descriptionHeader}>
          <div className={s.descriptionHeaderProfile}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            URLProfile
          </div>
          <button>...</button>
        </div>
        <div className={s.descriptionCommentsContainer}>
          <div className={s.descriptionCommentContainer}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionComment}>
              <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
            <img src="" alt="" className={s.descriptionCommentIcon} />
          </div>
          <div className={s.descriptionCommentContainer}>
            <img src="" alt="" className={s.descriptionAvatarImage} />
            <span className={s.descriptionComment}>
              <b>URLProfiele</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
            <img src="" alt="" className={s.descriptionCommentIcon} />
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
        <div className={s.descriptionLikes}>
          <div className={s.descriptionLikesIconsContainer}>
            <div className={s.descriptionLikesIcons}>
              <img src="" alt="" className={s.descriptionLikesIcon} />
              <img src="" alt="" className={s.descriptionLikesIcon} />
            </div>
            <img src="" alt="" className={s.descriptionLikesIcon} />
          </div>
          <div className={s.descriptionLikesAvatarsContainer}>
            <img src="" alt="" className={s.descriptionLikesAvatarImage} />
            <img src="" alt="" className={s.descriptionLikesAvatarImage} />
            <img src="" alt="" className={s.descriptionLikesAvatarImage} />
            <span>
              2 243 <b>"Like"</b>
            </span>
          </div>
          <span className={s.date}>July 3, 2021</span>
        </div>
        <div className={s.descriptionFooter}>
          <span>Add a Comment...</span>
          <button>Publish</button>
        </div>
      </div>
    </div>
  )
}
