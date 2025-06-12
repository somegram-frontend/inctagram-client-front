import { Items } from '@/api/post/posts-api.types'
import s from './post-following.module.scss'
import { Avatar } from '@/components/avatar'
import TimeAgo from 'react-timeago'

import {
  BookmarkOutline,
  Button,
  Heart,
  HeartOutline,
  MessageCircleOutline,
  MoreHorizontal,
  PaperPlaneOutline,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import PhotoSlider from '@/components/photoSlider'
import { Loader } from '@/components/loader'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { useCreateCommentMutation } from '@/api/comments/comments-api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { ViewPostComment } from './view-post-comments/ViewPostComment'
import React, { useState } from 'react'
import { useToggleLikePostMutation } from '@/api/post/posts-api'
import { useAppDispatch, useAppSelector } from '@/store'
import { chatsActions } from '@/api/chats/chats.slice'
import { sendMessage } from 'next/dist/client/components/react-dev-overlay/pages/websocket'
import { useRouter } from 'next/navigation'

type Props = {
  post: Items
  isFetching: boolean
}

export const PostFollowing = ({ post, isFetching }: Props) => {
  const { id, postOwnerInfo, createdAt } = post
  const [openedPost, setOpenedPost] = useState<boolean>(false)
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const defaultAva = '/MaskGroup.jpg'
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      z.object({
        comment: z.string().min(1, 'Min 1 symbol').max(300, 'Max 300 symbols'),
      }),
    ),
    defaultValues: { comment: '' },
    mode: 'onSubmit',
  })

  const [sendComment, { isLoading }] = useCreateCommentMutation()

  const handlePostComment = (data: { comment: string }) => {
    sendComment({ comment: data.comment, postId: post.id })
      .then(() => {
        toast.success('Comment is sent')
      })
      .catch(() => toast.error('Comment is not sent'))
    reset({ comment: '' })
  }
  const [toggleIsLiked, { isLoading: isLoadingLiked }] = useToggleLikePostMutation()

  const selectUserForChat = () => {
    dispatch(
      chatsActions.setSelectedUser({
        id: post.postOwnerInfo.userId,
        avatarUrl: post.postOwnerInfo.avatarUrl,
        userName: post.postOwnerInfo.username,
      }),
    )
    router.push('/messenger')
  }

  return (
    <section className={s.post} key={id}>
      <section className={s.postHeader}>
        <Avatar
          alt="avatar"
          className={s.avatar}
          imgSrc={postOwnerInfo.avatarUrl}
          userName={postOwnerInfo.username}
          width={36}
          height={36}
        />
        <Typography variant={'h3'} className={s.userName}>
          {postOwnerInfo.username}
        </Typography>
        <div className={s.dot} />
        <Typography className={s.timeAgo} as={'p'} variant={'small_text'}>
          <TimeAgo date={createdAt} live={false} />
        </Typography>

        <div className={s.edit}>
          <MoreHorizontal />
        </div>
      </section>
      <section className={s.photoSlider}>
        {isFetching && <Loader className={s.loader} />}
        <PhotoSlider imgClass={s.imagesPosts} images={post.images} dotClass={s.publicPostDots} />
      </section>
      <section className={s.postActions}>
        {isAuth && (
          <div className={s.descriptionCommentIconContainer}>
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
                className={` ${s.descriptionCommentIcon} ${isLoadingLiked ? s.disabledIcon : ''}`}
                onClick={() => {
                  if (!isLoadingLiked) {
                    toggleIsLiked({ postId: post.id, status: 'like' })
                  }
                }}
              />
            )}
          </div>
        )}
        <MessageCircleOutline className={s.message} onClick={selectUserForChat} />
        <PaperPlaneOutline />
        <BookmarkOutline className={s.book} />
      </section>
      {!!post.description && (
        <section className={s.description}>
          <Avatar
            alt="avatar"
            imgSrc={post.postOwnerInfo.avatarUrl}
            userName={post.postOwnerInfo.username}
            className={s.avatar}
            width={36}
            height={36}
          />
          <Typography variant={'bold_text14'}>
            {post.postOwnerInfo.username}{' '}
            <Typography as={'span'} variant={'regular_text14'}>
              {post.description}
            </Typography>
          </Typography>
        </section>
      )}
      <section className={s.like}>
        <div className={s.likeUsersImages}>
          {post.like.lastLikeUser.map(likeUser => (
            <Avatar
              key={likeUser.userId}
              alt="avatar"
              imgSrc={likeUser.avatarUrl || defaultAva}
              className={s.avatarImage}
              width={36}
              height={36}
            />
          ))}
        </div>

        <Typography variant={'regular_text14'}>
          {post.like.likeCount}
          <Typography as={'span'} variant={'bold_text14'}>
            {' '}
            &quot;Like&quot;
          </Typography>
        </Typography>
      </section>
      <section className={s.viewComments}>
        <ViewPostComment post={post} opened={openedPost} setOpenedPost={setOpenedPost} />
      </section>
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
          placeholder="Add a Comment..."
          width="100%"
        />
        <Button type="submit" variant="borderless" className={s.btnForm} disabled={isLoading}>
          <Typography variant="h3">Publish</Typography>
        </Button>
      </form>
    </section>
  )
}
