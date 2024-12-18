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
import defaultAva from '@/assets/images/Mask group.jpg'
import {useState} from 'react'
import {ItemsType} from '@/api/post/posts-api.types'
import {PostComment} from './addPost/postComment'
import PhotoSlider from '@/components/photoSlider'
import {useDeleteUserPostMutation} from '@/api/post/posts-api'
import {useRouter} from 'next/router'
import {Loader} from '@/components/loader'
import {useMeQuery} from '@/api/auth/auth-api'

type Props = {
  setEditPost?: (value: boolean) => void
  post: ItemsType
}

export const Post = ({setEditPost, post}: Props) => {
  const [editMenu, setEditMenu] = useState(false)
  const router = useRouter()
  const {data: me} = useMeQuery()
  const id = router.query.id as string

  const isOwner = me?.userId === id

  const [deletePost, {isLoading, isSuccess}] = useDeleteUserPostMutation()

  const onEditClickHandler = () => {
    setEditMenu(editMenu => !editMenu)
  }
  const deletePostHandler = async () => {
    await deletePost({postId: post.id})
  }

  const buttonMenuClass = editMenu ? `${s.buttonMenu} ${s.visible}` : `${s.buttonMenu}`

  if (isLoading) {
    return <Loader/>
  }

  if (isSuccess) {
    setEditPost && setEditPost(false)
    router.push(`/user/${post.postOwnerInfo.userId}`)
  }

  const dotsClass = post.images.length > 1 ? s.postDots : ''

  return (
    <div className={s.postContainer}>
      <PhotoSlider
        images={post.images}
        className={s.postImage}
        dotClass={dotsClass}
        imgClass={s.image}
      />
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <Image
              src={post?.postOwnerInfo.avatarUrl || defaultAva}
              alt="my avatar"
              width={40}
              height={40}
              className={s.descriptionAvatarImage}

            />
            <Typography variant="bold_text16">{post?.postOwnerInfo.username}</Typography>
          </div>
          {isOwner && (
            <>
              <button onClick={onEditClickHandler}>
                <MoreHorizontalOutline className={s.descriptionHeaderButton}/>
              </button>
              <div className={buttonMenuClass}>
                <ul>
                  <li onClick={() => (setEditPost ? setEditPost(true) : {})}>
                    <Edit2Outline/>
                    Edit Post
                  </li>
                  <li onClick={() => deletePostHandler()}>
                    <TrashOutline/>
                    Delete Post
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className={`${s.descriptionCommentsContainer} ${s.wrapper}`}>
          <PostComment
            description={post?.description}
            userName={post?.postOwnerInfo.username}
            userAvatar={post?.postOwnerInfo.avatarUrl}
          />
        </div>
        <div className={`${s.descriptionReactions} ${s.wrapper}`}>
          <div className={`${s.descriptionReactionsIconsContainer}`}>
            <div className={s.descriptionReactionsIcons}>
              <HeartOutline className={s.descriptionReactionsIcon}/>
              <PaperPlaneOutline className={s.descriptionReactionsIcon}/>
            </div>
            <BookmarkOutline className={s.descriptionReactionsIcon}/>
          </div>
          <div className={s.descriptionReactionsAvatarsContainer}>
            <Image
              src={defaultAva}
              alt="defaultAva"
              className={s.descriptionReactionsAvatarImage}

            />
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
