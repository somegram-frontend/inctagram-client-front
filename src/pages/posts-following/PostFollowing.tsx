import { Items } from '@/api/post/posts-api.types'
import s from './PostsFollowing.module.scss'
import { Avatar } from '@/components/avatar'
import TimeAgo from 'react-timeago'

import {
  BookmarkOutline,
  Button,
  HeartOutline,
  MessageCircleOutline,
  MoreHorizontal,
  PaperPlaneOutline,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import PhotoSlider from '@/components/photoSlider'
import { Loader } from '@/components/loader'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { useCreateCommentMutation, useFetchCommentsQuery } from '@/api/comments/comments-api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'

type Props = {
  post: Items
  isFetching: boolean
}

export const PostFollowing = ({ post, isFetching }: Props) => {
  const { id, postOwnerInfo, createdAt } = post

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
  const { data: commentsData } = useFetchCommentsQuery({ postId: post.id })

  const handlePostComment = (data: { comment: string }) => {
    sendComment({ comment: data.comment, postId: post.id }).then(() => {
      toast.success('Comment is sent')
    }).catch(() => toast.error('Comment is not sent'))
    reset({ comment: '' })
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
        <HeartOutline />
        <MessageCircleOutline className={s.message} />
        <PaperPlaneOutline />
        <BookmarkOutline className={s.book} />
      </section>
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
            bla bla
          </Typography>
        </Typography>
      </section>
      <section className={s.like}>
        <div className={s.likeUsersImages}>
          {post.like.lastLikeUser.map(likeUser => (
            <Avatar
              key={likeUser.userId}
              alt="avatar"
              imgSrc={likeUser.avatarUrl}
              className={s.avatar}
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
        <Typography as={'p'} variant={'bold_text14'}>
          View All Comments ({commentsData && commentsData.items.length})
        </Typography>
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
