import { baseApi } from '../_base/base-api'
import {
  AnswerCommentResponse,
  CreateAnswerCommentRequest,
  CreateCommentRequest,
  GetCommentResponse,
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
      fetchComments: builder.query<GetCommentResponse, { postId: string; pageNumber: number }>({
        query: ({ postId, pageNumber }) => ({
          url: `/v1/public-posts/comments/${postId}`,
          params: { pageNumber, pageSize: 10 },
        }),
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
        // Only fetch new data when pageNumber changes
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

          // Prevent duplicates by checking ids
          const existingIds = new Set(currentCache.items.map(item => item.id))
          const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

          return {
            ...newItems,
            items: [...currentCache.items, ...uniqueNewItems],
            totalCount: newItems.totalCount,
          }
        },
        // Only fetch new data when pageNumber changes
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
} = commentsApi
