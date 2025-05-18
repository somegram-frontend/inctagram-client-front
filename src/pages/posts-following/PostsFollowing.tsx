import React, { useState } from 'react'
import { useGetPostsFollowingQuery } from '@/api/post/posts-api'
import s from './PostsFollowing.module.scss'
import { Items } from '@/api/post/posts-api.types'
import { useInfiniteScroll } from '@/shared/hooks'
import { PostFollowing } from './PostFollowing'

const PostsFollowing = () => {
  const [posts, setPosts] = useState<Items[]>([])
  const [endCursorPostId, setEndCursorPostId] = useState('')

  const { data: followingPosts, isFetching } = useGetPostsFollowingQuery({
    endCursorPostId: endCursorPostId || '',
    pageSize: 8,
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
        <PostFollowing post={post} isFetching={isFetching} />
      ))}
      <div className={s.cursor} ref={lastElementRef} />
    </section>
  )
}

export default PostsFollowing
