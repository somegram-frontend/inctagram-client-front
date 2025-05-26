import React, { useState, useEffect } from 'react'
import { Heart, HeartOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import s from '../../../../../../components/post/post.module.scss'
import { Avatar } from '@/components/avatar'
import { useAppSelector } from '@/store'
import TimeAgo from 'react-timeago'
import {
  useFetchAnswerCommentQuery,
  useToggleLikeCommentMutation,
} from '@/api/comments/comments-api'
import PostAnswerComment from '@/pages/user/[id]/post/addPost/postComment/postAnswerComment'
import { useInfiniteScroll } from '@/shared/hooks'

type CommentProps = {
  description?: string | null
  postId: string
  isDescription?: boolean
  userName: string
  userAvatar: string
  createdAt: string
  commentId: string
  likeCount?: number
  setCommentId?: (commentId: string) => void
  isLiked?: boolean
}

const PostComment = (props: CommentProps) => {
  const {
    description,
    userName,
    userAvatar,
    commentId,
    createdAt,
    likeCount,
    isDescription = false,
    setCommentId,
    postId,
    isLiked = false,
  } = props
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const [viewAnswer, setViewAnswer] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isLoading, isFetching } = useFetchAnswerCommentQuery({ commentId, pageNumber })
  const [toggleIsLiked, { isLoading: isLoadindLiked }] = useToggleLikeCommentMutation()

  useEffect(() => {
    if (!viewAnswer) {
      setPageNumber(1)
    }
  }, [viewAnswer])

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0

  const loadedItemsCount = (pageNumber - 1) * 10 + totalItems
  const hasMoreItems = totalCount > loadedItemsCount

  const loadMore = () => {
    if (!isFetching && hasMoreItems) {
      console.log('Loading more items, increasing page to:', pageNumber + 1)
      setPageNumber(prev => prev + 1)
    }
  }

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  return (
    <div className={s.commentWrapper}>
      <div className={s.descriptionCommentContainer}>
        {description ? (
          <>
            <Avatar
              alt={`Avatar for ${userName}`}
              width={40}
              height={40}
              imgSrc={userAvatar}
              userName={userName}
              className={s.avatar}
            />
            <div className={s.commentContainer}>
              <Typography variant="regular_text14" className={s.descriptionComment}>
                <b>{userName}</b> {description}
              </Typography>
              <div className={s.bottomWrapperSection}>
                <Typography className={s.timeAgo} as={'p'} variant={'small_text'}>
                  <TimeAgo date={createdAt} live={false} />
                </Typography>
                <Typography className={s.like} variant={'semi_bold_small_text'}>
                  {!!likeCount && <span>{'Like: ' + likeCount}</span>}
                </Typography>
                {!isDescription && isAuth && setCommentId && (
                  <Typography
                    className={s.answerBtn}
                    variant={'semi_bold_small_text'}
                    onClick={() => setCommentId(commentId)}
                    as={'button'}
                  >
                    Answer
                  </Typography>
                )}
              </div>

              {data && data.items.length > 0 && (
                <div className={s.viewAnswerButton}>
                  <span></span>
                  <Typography
                    variant={'semi_bold_small_text'}
                    as={'button'}
                    onClick={() => setViewAnswer(!viewAnswer)}
                  >
                    {viewAnswer ? 'Hide answers' : `View Answers (${data?.totalCount})`}
                  </Typography>
                </div>
              )}
            </div>
          </>
        ) : (
          <Typography variant="regular_text14">This post has no description...yet.</Typography>
        )}
        {isAuth && !isDescription && (
          <div className={s.descriptionCommentIconContainer}>
            {isLiked ? (
              <Heart
                className={` ${s.descriptionCommentIcon} ${s.iconActive} ${
                  isLoadindLiked ? s.disabledIcon : ''
                }`}
                onClick={() => {
                  if (!isLoadindLiked) {
                    toggleIsLiked({ postId, commentId, status: 'none' })
                  }
                }}
              />
            ) : (
              <HeartOutline
                aria-disabled={isLoadindLiked}
                className={` ${s.descriptionCommentIcon} ${isLoadindLiked ? s.disabledIcon : ''}`}
                onClick={() => {
                  if (!isLoadindLiked) {
                    toggleIsLiked({ postId, commentId, status: 'like' })
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
      {viewAnswer && data && data.items && (
        <div className={s.answers}>
          {data.items.map(item => (
            <PostAnswerComment
              key={item.id}
              commentId={commentId}
              answer={item}
              setCommentId={setCommentId}
            />
          ))}
          {isLoading && <div className={s.loading}>Loading answers...</div>}
          <div className={s.cursor} ref={lastElementRef} />
        </div>
      )}
    </div>
  )
}

export default PostComment
