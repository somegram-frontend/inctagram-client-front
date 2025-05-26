import { baseApi } from '../_base/base-api'
import {
  AnswerCommentResponse,
  CreateAnswerCommentRequest,
  CreateCommentRequest,
  GetCommentResponse,
  SetLikeAnswerCommentPayload,
  SetLikeCommentResponse,
} from './comments-api.types'

export const commentsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      createComment: builder.mutation<void, CreateCommentRequest>({
        query: data => {
          return {
            url: `/v1/posts/comments/${data.postId}`,
            method: 'POST',
            body: {
              body: data.comment,
            },
          }
        },
        invalidatesTags: (_, __, { postId }) => [{ type: 'Comments', id: postId }],
      }),

      createAnswerComment: builder.mutation<void, CreateAnswerCommentRequest>({
        query: data => {
          return {
            url: `/v1/posts/comments/answer-comment/${data.commentId}`,
            method: 'POST',
            body: {
              body: data.comment,
            },
          }
        },
        invalidatesTags: (_, __, { commentId }) => [{ type: 'Answers', id: commentId }],
      }),

      toggleLikeComment: builder.mutation<void, SetLikeCommentResponse>({
        query: data => {
          return {
            url: `/v1/posts/comments/like/${data.commentId}`,
            method: 'PUT',
            body: {
              status: data.status,
            },
          }
        },
        async onQueryStarted(
          { commentId, postId, status },
          { dispatch, queryFulfilled, getState },
        ) {
          const patches: any[] = []

          const state = getState() as any
          const commentsQueries = state.baseApi.queries

          Object.keys(commentsQueries).forEach(key => {
            if (key.startsWith('fetchComments') && commentsQueries[key]?.data) {
              const queryArgs = commentsQueries[key].originalArgs
              if (queryArgs?.postId === postId) {
                const patchResult = dispatch(
                  commentsApi.util.updateQueryData('fetchComments', queryArgs, draft => {
                    const comment = draft.items.find(item => item.id === commentId)
                    if (comment && comment.like) {
                      const currentStatus = comment.like.myStatus

                      if (currentStatus === 'like' && status === 'dislike') {
                        comment.like.likesCount = Math.max(0, comment.like.likesCount - 1)
                        comment.like.dislikeCount += 1
                      } else if (currentStatus === 'like' && status === 'none') {
                        comment.like.likesCount = Math.max(0, comment.like.likesCount - 1)
                      } else if (currentStatus === 'dislike' && status === 'like') {
                        comment.like.dislikeCount = Math.max(0, comment.like.dislikeCount - 1)
                        comment.like.likesCount += 1
                      } else if (currentStatus === 'dislike' && status === 'none') {
                        comment.like.dislikeCount = Math.max(0, comment.like.dislikeCount - 1)
                      } else if (currentStatus === 'none' && status === 'like') {
                        comment.like.likesCount += 1
                      } else if (currentStatus === 'none' && status === 'dislike') {
                        comment.like.dislikeCount += 1
                      }

                      comment.like.myStatus = status
                    }
                  }),
                )
                patches.push(patchResult)
              }
            }
          })

          try {
            await queryFulfilled
          } catch {
            patches.forEach(patch => patch.undo())
          }
        },
      }),
      toggleLikeAnswerComment: builder.mutation<void, SetLikeAnswerCommentPayload>({
        query: data => {
          return {
            url: `/v1/posts/comments/like/${data.answerId}`,
            method: 'PUT',
            body: {
              status: data.status,
            },
          }
        },
        async onQueryStarted(
          { commentId, answerId, status },
          { dispatch, queryFulfilled, getState },
        ) {
          const patchResults: any[] = []

          const state = getState() as any
          const answerCommentQueries = state.baseApi.queries

          Object.keys(answerCommentQueries).forEach(key => {
            if (key.startsWith('fetchAnswerComment') && answerCommentQueries[key]?.data) {
              const queryArgs = answerCommentQueries[key].originalArgs

              if (queryArgs?.commentId === commentId) {
                const patchResult = dispatch(
                  commentsApi.util.updateQueryData('fetchAnswerComment', queryArgs, draft => {
                    const targetAnswer = draft.items.find(item => item.id === answerId)

                    if (targetAnswer && targetAnswer.like) {
                      const { like } = targetAnswer
                      const prevStatus = like.myStatus
                      if (prevStatus === 'like') {
                        like.likesCount = Math.max(0, like.likesCount - 1)
                      } else if (prevStatus === 'dislike') {
                        like.dislikeCount = Math.max(0, like.dislikeCount - 1)
                      }

                      if (status === 'like') {
                        like.likesCount += 1
                      } else if (status === 'dislike') {
                        like.dislikeCount += 1
                      }

                      like.myStatus = status
                    }
                  }),
                )
                patchResults.push(patchResult)
              }
            }
          })

          try {
            await queryFulfilled
          } catch {
            patchResults.forEach(patch => patch.undo())
          }
        },
      }),

      fetchComments: builder.query<GetCommentResponse, { postId: string; pageNumber: number }>({
        query: ({ postId, pageNumber }) => {
          return {
            url: `/v1/public-posts/comments/${postId}`,
            params: { pageNumber, pageSize: 10 },
          }
        },
        providesTags: (result, error, { postId }) =>
          result
            ? [
                ...result.items.map(({ id }) => ({ type: 'Comments' as const, id })),
                { type: 'Comments', id: postId },
              ]
            : [{ type: 'Comments', id: postId }],
        serializeQueryArgs: ({ queryArgs }) => {
          return { postId: queryArgs.postId }
        },
        merge: (currentCache, newItems, { arg }) => {
          if (arg.pageNumber === 1) {
            return newItems
          }

          const existingIds = new Set(currentCache.items.map(item => item.id))
          const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

          return {
            ...newItems,
            items: [...currentCache.items, ...uniqueNewItems],
            totalCount: newItems.totalCount,
          }
        },
        forceRefetch({ currentArg, previousArg }) {
          return (
            currentArg?.pageNumber !== previousArg?.pageNumber ||
            currentArg?.postId !== previousArg?.postId
          )
        },
      }),

      fetchAnswerComment: builder.query<
        AnswerCommentResponse,
        { commentId: string; pageNumber: number }
      >({
        query: ({ commentId, pageNumber }) => ({
          url: `/v1/posts/comments/${commentId}/answer-comment`,
          params: { pageNumber, pageSize: 10 },
        }),
        providesTags: (result, error, { commentId }) =>
          result
            ? [
                ...result.items.map(({ id }) => ({ type: 'Answers' as const, id })),
                { type: 'Answers', id: commentId },
              ]
            : [{ type: 'Answers', id: commentId }],
        serializeQueryArgs: ({ queryArgs }) => {
          return { commentId: queryArgs.commentId }
        },
        merge: (currentCache, newItems, { arg }) => {
          if (arg.pageNumber === 1) {
            return newItems
          }

          const existingIds = new Set(currentCache.items.map(item => item.id))
          const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

          return {
            ...newItems,
            items: [...currentCache.items, ...uniqueNewItems],
            totalCount: newItems.totalCount,
          }
        },
        forceRefetch({ currentArg, previousArg }) {
          return (
            currentArg?.pageNumber !== previousArg?.pageNumber ||
            currentArg?.commentId !== previousArg?.commentId
          )
        },
      }),
    }
  },
})

export const {
  useCreateCommentMutation,
  useFetchCommentsQuery,
  useFetchAnswerCommentQuery,
  useCreateAnswerCommentMutation,
  useToggleLikeCommentMutation,
  useToggleLikeAnswerCommentMutation,
} = commentsApi
