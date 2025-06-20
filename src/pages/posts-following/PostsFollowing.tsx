import React, { useState } from 'react'
import { useGetPostsFollowingQuery, useGetPublicPostsForLeedQuery } from '@/api/post/posts-api'
import s from './PostsFollowing.module.scss'
import { useInfiniteScroll } from '@/shared/hooks'
import { PostFollowing } from '@/features/post-following/PostFollowing'

const PostsFollowing = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [pagePublicPosts, setPagePublicPosts] = useState(1)
  const [cursor, setCursor] = useState<string>('')
  const [cursorPublic, setCursorPublic] = useState<string>('')

  const { data, isFetching } = useGetPostsFollowingQuery({
    endCursorPostId: cursor,
    pageNumber: pageNumber,
    pageSize: 8,
  })

  const { data: publicPosts, isFetching: isPublicFetching } = useGetPublicPostsForLeedQuery({
    endCursorPostId: cursorPublic,
    pageNumber: pagePublicPosts,
    pageSize: 8,
  })

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0
  const totalPublicCount = publicPosts?.totalCount || 0

  const loadedItemsCount = (pageNumber - 1) * 8 + totalItems
  const hasMoreItems = true

  const loadMore = () => {
    console.log('pageNumber', pageNumber)
    console.log('publicPosts', pagePublicPosts)
    if (!isFetching && hasMoreItems && !isPublicFetching) {
      const newCursor =
        data?.pagesCount && pageNumber >= data?.pagesCount
          ? publicPosts?.items[publicPosts?.items?.length - 1]?.id
          : data?.items[data?.items?.length - 1]?.id

      if (data?.pagesCount && pageNumber >= data?.pagesCount) {
        setPagePublicPosts(prevState => prevState + 1)
        newCursor && setCursorPublic(newCursor)
      } else {
        setPageNumber(prev => prev + 1)
        newCursor && setCursor(newCursor)
      }
    }
  }

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  return (
    <div className={s.containerPostsFollowing}>
      {data?.items?.map(post => (
        <PostFollowing key={post.id} post={post} isFetching={isFetching} />
      ))}
      {publicPosts?.items?.map(post => (
        <PostFollowing key={post.id} post={post} isFetching={isFetching} />
      ))}
      <div className={s.cursor} ref={lastElementRef} />
    </div>
  )
}

export default PostsFollowing
