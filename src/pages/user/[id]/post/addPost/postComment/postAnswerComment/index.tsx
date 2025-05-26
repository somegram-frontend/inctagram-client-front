import React from 'react'
import { Heart, HeartOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import s from '../../../../../../../components/post/post.module.scss'
import { Avatar } from '@/components/avatar'
import { useAppSelector } from '@/store'
import TimeAgo from 'react-timeago'
import { Answer } from '@/api/comments/comments-api.types'
import { useToggleLikeAnswerCommentMutation } from '@/api/comments/comments-api'

type CommentProps = {
  answer: Answer
  commentId: string
  setCommentId?: (commentId: string) => void
}

const PostAnswerComment = (props: CommentProps) => {
  const { answer, setCommentId, commentId } = props
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const [toggleIsLiked, { isLoading: isLoadindLiked }] = useToggleLikeAnswerCommentMutation()
  const isLiked = answer.like.myStatus === 'like'

  return (
    <div className={s.answerComment}>
      <Avatar
        alt={`Avatar for ${answer.user.username}`}
        width={40}
        height={40}
        imgSrc={answer.user.avatarUrl}
        userName={answer.user.username}
        className={s.avatar}
      />
      <div className={s.commentContainer}>
        <Typography variant="regular_text14" className={s.descriptionComment}>
          <b>{answer.user.username}</b> {answer.body}
        </Typography>
        <div className={s.bottomWrapperSection}>
          <Typography className={s.timeAgo} as={'p'} variant={'small_text'}>
            <TimeAgo date={answer.createdAt} live={false} />
          </Typography>
          <Typography className={s.like} variant={'semi_bold_small_text'}>
            {!!answer.like.likesCount && <span>{'Like: ' + answer.like.likesCount}</span>}
          </Typography>
          {isAuth && setCommentId && (
            <Typography
              className={s.answerBtn}
              variant={'semi_bold_small_text'}
              onClick={() => setCommentId(answer.answerForCommentId)}
              as={'button'}
            >
              Answer
            </Typography>
          )}
        </div>
      </div>

      {isAuth && (
        <div className={s.descriptionCommentIconContainer}>
          {isLiked ? (
            <Heart
              className={` ${s.descriptionCommentIcon} ${s.iconActive} ${
                isLoadindLiked ? s.disabledIcon : ''
              }`}
              onClick={() => {
                if (!isLoadindLiked) {
                  toggleIsLiked({ answerId: answer.id, commentId, status: 'none' })
                }
              }}
            />
          ) : (
            <HeartOutline
              aria-disabled={isLoadindLiked}
              className={` ${s.descriptionCommentIcon} ${isLoadindLiked ? s.disabledIcon : ''}`}
              onClick={() => {
                if (!isLoadindLiked) {
                  toggleIsLiked({ answerId: answer.id, commentId, status: 'like' })
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default PostAnswerComment
