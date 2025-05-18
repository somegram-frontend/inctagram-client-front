import { baseApi } from '../_base/base-api'
import { CreateCommentRequest, GetCommentResponse } from './comments-api.types'

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
        invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
      }),
      fetchComments: builder.query<GetCommentResponse, { postId: string }>({
        query: ({ postId }) => ({
          url: `/v1/public-posts/comments/${postId}`,
        }),
        providesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
      }),
    }
  },
})

export const { useCreateCommentMutation, useFetchCommentsQuery } = commentsApi
