import { ItemsType } from '@/api/post/posts-api.types'
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useMeQuery } from '@/api/auth/auth-api'
import { useDeleteUserPostMutation, useToggleLikePostMutation } from '@/api/post/posts-api'
import { toast } from 'react-toastify'
import s from './post.module.scss'
import { Loader } from '@/components/loader'
import PhotoSlider from '@/components/photoSlider'
import Image from 'next/image'
import {
  BookmarkOutline,
  Button,
  Edit2Outline,
  Heart,
  HeartOutline,
  MoreHorizontalOutline,
  PaperPlaneOutline,
  TrashOutline,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import PostComment from '@/pages/user/[id]/post/addPost/postComment'
import ConfirmDeletePost from '@/pages/user/[id]/post/confirmDeletePost'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useCreateAnswerCommentMutation,
  useCreateCommentMutation,
  useFetchCommentsQuery,
} from '@/api/comments/comments-api'
import { ControlledInput } from '../controlled/ControlledInput'
import { formatNumberWithSpaces } from '@/shared/utils/formatNumberWithSpaces'
import { useInfiniteScroll } from '@/shared/hooks'
import { useAppSelector } from '@/store'

type Props = {
  setEditPost?: (value: boolean) => void
  post: ItemsType
}

export const Post = ({ setEditPost, post }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const defaultAva = '/MaskGroup.jpg'
  const [editMenu, setEditMenu] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [selectedComment, setSelectedComment] = useState<null | string>(null)
  const [page, setPage] = useState<number>(1)
  const router = useRouter()
  const { data: me } = useMeQuery()
  const id = router.query.id as string
  const isOwner = me?.userId === id
  const isAuth = useAppSelector(state => state.auth.isAuth)

  const { control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(
      z.object({
        comment: z.string().min(1, 'Min 1 symbol').max(300, 'Max 300 symbols'),
      }),
    ),
    defaultValues: { comment: '' },
    mode: 'onSubmit',
  })

  const [sendComment, { isLoading: isLoadingCreateComment }] = useCreateCommentMutation()
  const [sendAnswer, { isLoading: isLoadingCreateAnswer }] = useCreateAnswerCommentMutation()
  const { data, isFetching } = useFetchCommentsQuery({
    postId: post.id,
    pageNumber: page,
  })
  const [toggleIsLiked, { isLoading: isLoadingLiked }] = useToggleLikePostMutation()

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0

  const loadedItemsCount = (page - 1) * 10 + totalItems
  const hasMoreItems = totalCount > loadedItemsCount

  const loadMore = () => {
    if (!isFetching && hasMoreItems) {
      console.log('Loading more items, increasing page to:', page + 1)
      setPage(prev => prev + 1)
    }
  }

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  const [deletePost, { isLoading, isSuccess }] = useDeleteUserPostMutation()

  const onEditClickHandler = () => {
    setEditMenu(editMenu => !editMenu)
  }
  const deletePostHandler = async () => {
    try {
      await deletePost({ postId: post.id }).unwrap()
      toast.success('Post deleted successfully')
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const cancelDeleteHandler = () => {
    setShowConfirmDelete(false)
  }

  const confirmDeleteHandler = () => {
    deletePostHandler()
    setShowConfirmDelete(false)
  }

  const buttonMenuClass = editMenu ? `${s.buttonMenu} ${s.visible}` : `${s.buttonMenu}`

  if (isLoading) {
    return <Loader />
  }

  if (isSuccess) {
    setEditPost && setEditPost(false)
    router.push(`/user/${post.postOwnerInfo.userId}`)
  }

  const handlePostComment = (data: { comment: string }) => {
    if (selectedComment) {
      sendAnswer({ comment: data.comment, commentId: selectedComment })
        .then(() => {
          toast.success('Answer is sent')
        })
        .catch(() => toast.error('Answer is not sent'))
    } else {
      sendComment({ comment: data.comment, postId: post.id })
        .then(() => {
          toast.success('Comment is sent')
        })
        .catch(() => toast.error('Comment is not sent'))
    }

    reset({ comment: '' })
  }

  const dotsClass = post?.images.length > 1 ? s.postDots : ''

  const selectedCommentHandler = (commentId: string) => {
    setSelectedComment(commentId)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className={s.postContainer}>
      <div className={s.slider}>
        <PhotoSlider images={post?.images || []} dotClass={dotsClass} imgClass={s.image} />
      </div>
      <div className={s.descriptionContainer}>
        <div className={`${s.descriptionHeader} ${s.wrapper}`}>
          <div className={s.descriptionHeaderProfile}>
            <Image
              src={post?.postOwnerInfo?.avatarUrl || defaultAva}
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
                <MoreHorizontalOutline className={s.descriptionHeaderButton} />
              </button>
              <div className={buttonMenuClass}>
                <ul>
                  <li onClick={() => (setEditPost ? setEditPost(true) : {})}>
                    <Edit2Outline />
                    Edit Post
                  </li>
                  <li onClick={() => setShowConfirmDelete(true)}>
                    <TrashOutline />
                    Delete Post
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className={`${s.descriptionCommentsContainer} ${s.wrapper}`}>
          {post.description && (
            <PostComment
              commentId={post.id}
              description={post?.description}
              userName={post?.postOwnerInfo.username}
              userAvatar={post?.postOwnerInfo.avatarUrl}
              createdAt={post.createdAt}
              postId={post.id}
              isDescription
            />
          )}
          {data?.items.map(comment => {
            console.log(comment)

            return (
              <PostComment
                key={comment.id}
                postId={post.id}
                commentId={comment.id}
                createdAt={comment.createdAt}
                description={comment.body}
                userName={comment.user.username}
                userAvatar={comment.user.avatarUrl}
                likeCount={comment.like.likesCount}
                setCommentId={selectedCommentHandler}
                isLiked={comment.like.myStatus === 'like'}
              />
            )
          })}
          <div className={s.cursor} ref={lastElementRef} />
        </div>
        <div className={`${s.descriptionReactions} ${s.wrapper}`}>
          {isAuth && (
            <div className={`${s.descriptionReactionsIconsContainer}`}>
              <div className={s.descriptionReactionsIcons}>
                {post.like.myStatus === 'like' ? (
                  <Heart
                    className={` ${s.descriptionCommentIcon} ${s.iconActive} ${
                      isLoadingLiked ? s.disabledIcon : ''
                    }`}
                    onClick={() => {
                      if (!isLoadingLiked) {
                        toggleIsLiked({ postId: post.id, status: 'none' })
                      }
                    }}
                  />
                ) : (
                  <HeartOutline
                    aria-disabled={isLoadingLiked}
                    className={` ${s.descriptionCommentIcon} ${
                      isLoadingLiked ? s.disabledIcon : ''
                    }`}
                    onClick={() => {
                      if (!isLoadingLiked) {
                        toggleIsLiked({ postId: post.id, status: 'like' })
                      }
                    }}
                  />
                )}
                <PaperPlaneOutline className={s.descriptionReactionsIcon} />
              </div>
              <BookmarkOutline className={s.descriptionReactionsIcon} />
            </div>
          )}
          <div className={s.descriptionReactionsAvatarsContainer}>
            {post.like.lastLikeUser.map(user => {
              return (
                <Image
                  key={user.userId}
                  src={user.avatarUrl || defaultAva}
                  alt="defaultAva"
                  className={s.descriptionReactionsAvatarImage}
                  width={100}
                  height={100}
                />
              )
            })}
            <span>
              {formatNumberWithSpaces(post.like.likeCount)} <b>&quot;Like&quot;</b>
            </span>
          </div>
          <span className={s.date}>July 3, 2021</span>
        </div>
        <div className={`${s.descriptionFooter} ${s.wrapper}`}>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(handlePostComment)(e)
            }}
            className={s.form}
          >
            <ControlledInput
              control={control}
              name="comment"
              placeholder={selectedComment ? 'Add answer for comment' : 'Add a Comment...'}
              inputRef={inputRef}
              onBlurCapture={() => {
                if (!watch('comment').trim()) {
                  setSelectedComment(null)
                }
              }}
              width="100%"
            />
            <Button
              type="submit"
              variant="borderless"
              className={s.btnForm}
              disabled={isLoadingCreateComment || isLoadingCreateAnswer}
            >
              <Typography variant="h3">Publish</Typography>
            </Button>
          </form>
        </div>
      </div>
      {showConfirmDelete && (
        <ConfirmDeletePost onConfirm={confirmDeleteHandler} onCancel={cancelDeleteHandler} />
      )}
    </div>
  )
}
