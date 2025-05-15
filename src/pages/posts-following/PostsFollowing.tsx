import React, { useState } from 'react'
import { useGetPostsFollowingQuery } from '@/api/post/posts-api'
import s from './PostsFollowing.module.scss'
import Image from 'next/image'
import {
  BookmarkOutline,
  Button,
  HeartOutline,
  MessageCircleOutline,
  MoreHorizontal,
  PaperPlaneOutline,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import TimeAgo from 'react-timeago'
import PhotoSlider from '@/components/photoSlider'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { useForm } from 'react-hook-form'
import { Items } from '@/api/post/posts-api.types'
import { Loader } from '@/components/loader'
import { useInfiniteScroll } from '@/shared/hooks'

const PostsFollowing = () => {
  const [posts, setPosts] = useState<Items[]>([])
  const [endCursorPostId, setEndCursorPostId] = useState('')

  const { data: followingPosts, isFetching } = useGetPostsFollowingQuery({
    endCursorPostId: endCursorPostId || '',
    pageSize: 3,
  })

  const { control, trigger } = useForm({
    defaultValues: {
      comment: '',
    },
  })

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: Boolean(followingPosts?.items.length),
    fetchNext: () => {
      if (followingPosts?.items) {
        setPosts(prev => [...prev, ...followingPosts?.items])
        setEndCursorPostId(followingPosts?.items.at(-1)?.id || '')
      }
    },
  })

  return (
    <section className={s.containerPostsFollowing}>
      {posts.map(post => (
        <section className={s.post} key={post.id}>
          <section className={s.postHeader}>
            <Image
              className={s.postHeaderImage}
              src={post.postOwnerInfo.avatarUrl}
              alt={'avatar'}
              width={36}
              height={36}
            />
            <Typography variant={'h3'}>{post.postOwnerInfo.username}</Typography>
            <div className={s.dot} />
            <Typography className={s.timeAgo} as={'p'} variant={'small_text'}>
              <TimeAgo date={post.createdAt} live={false} />
            </Typography>

            <div className={s.edit}>
              <MoreHorizontal />
            </div>
          </section>
          <section className={s.photoSlider}>
            {isFetching && <Loader className={s.loader} />}
            <PhotoSlider
              imgClass={s.imagesPosts}
              images={post.images}
              dotClass={s.publicPostDots}
            />
          </section>
          <section className={s.postActions}>
            <HeartOutline />
            <MessageCircleOutline className={s.message} />
            <PaperPlaneOutline />
            <BookmarkOutline className={s.book} />
          </section>
          <section className={s.description}>
            <Image
              className={s.postHeaderImage}
              src={post.postOwnerInfo.avatarUrl}
              alt={'avatar'}
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
                <Image src={likeUser.avatarUrl} alt={'user like'} key={likeUser.userId} />
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
              View All Comments (114)
            </Typography>
          </section>
          <form className={s.form}>
            <ControlledInput
              className={s.input}
              control={control}
              trigger={trigger}
              name={'comment'}
              placeholder={'Add a Comment...'}
              width={'100%'}
            />
            <Button className={s.btnForm} variant={'borderless'}>
              <Typography variant={'h3'}>Publish</Typography>
            </Button>
          </form>
        </section>
      ))}
      <div className={s.cursor} ref={lastElementRef} />
    </section>
  )
}

export default PostsFollowing
