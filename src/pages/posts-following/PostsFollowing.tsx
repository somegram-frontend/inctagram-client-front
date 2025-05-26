import React, { useState } from 'react'
import { useGetPostsFollowingQuery } from '@/api/post/posts-api'
import s from './PostsFollowing.module.scss'
import { useInfiniteScroll } from '@/shared/hooks'
import { PostFollowing } from '@/features/post-following/PostFollowing'

const PostsFollowing = () => {
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isFetching } = useGetPostsFollowingQuery({
    endCursorPostId: '',
    pageSize: 8,
  })

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0

  const loadedItemsCount = (pageNumber - 1) * 10 + totalItems
  const hasMoreItems = totalCount > loadedItemsCount

  const loadMore = () => {
    if (!isFetching && hasMoreItems) {
      setPageNumber(prev => prev + 1)
    }
  }

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  return (
    <section className={s.containerPostsFollowing}>
      {data?.items.map(post => <PostFollowing key={post.id} post={post} isFetching={isFetching} />)}
      <div className={s.cursor} ref={lastElementRef} />
    </section>
  )
}

export default PostsFollowing
