import { baseApi } from '@/api/_base/base-api'
import {
  AddUserPostsArgs,
  ApiResponse,
  GetPublicPostsArgs,
  GetPublicPostsResponse,
  GetUserPostsArgs,
  GetUserPostsResponse,
  ItemsType,
  UpdateUserPostArgs,
  UpdateUserPostResponse,
} from './posts-api.types'
import { createEntityAdapter } from '@reduxjs/toolkit'

const adapter = createEntityAdapter<ItemsType>()
const state = adapter.getInitialState()

export const { selectAll } = adapter.getSelectors()

type NewReturn = {
  state: ReturnType<typeof adapter.getInitialState>
  pageSize: number
  totalCount: number
  pagesCount: number
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      getUserPosts: builder.query<NewReturn, GetUserPostsArgs>({
        query: ({ userId, endCursorPostId, pageNumber, pageSize }) => ({
          url: `v1/posts/${userId}${endCursorPostId ? `/${endCursorPostId}` : ''}`,
          params: { pageNumber, pageSize },
        }),
        providesTags: ['Posts'],
        transformResponse: (response: GetUserPostsResponse) => {
          const { items, ...rest } = response
          return {
            state: adapter.addMany(state, response.items),
            ...rest,
          }
        },
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          return `${endpointName}-${queryArgs.userId}`
        },
        merge: (currentCache, newItems) => {
          adapter.addMany(currentCache.state, newItems.state.entities)
        },
        forceRefetch({ currentArg, previousArg }) {
          return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
        },
      }),
      addUserPosts: builder.mutation<ApiResponse, AddUserPostsArgs>({
        query: ({ files, description }) => {
          const formData = new FormData()
          files.forEach(file => formData.append('files', file))
          formData.append('description', description)
          return {
            url: 'v1/posts',
            method: 'POST',
            body: formData,
          }
        },
        invalidatesTags: ['Posts'],
      }),
      updateUserPost: builder.mutation<UpdateUserPostResponse, UpdateUserPostArgs>({
        query: ({ postId, description }) => {
          return {
            url: `v1/posts/${postId}`,
            method: 'PUT',
            body: { description },
          }
        },
        invalidatesTags: ['Posts'],
      }),
      deleteUserPost: builder.mutation<ApiResponse, { postId: string }>({
        query: ({ postId }) => {
          return {
            url: `v1/posts/${postId}`,
            method: 'DELETE',
          }
        },
        invalidatesTags: ['Posts'],
      }),
      getPublicPosts: builder.query<GetPublicPostsResponse, GetPublicPostsArgs>({
        query: ({ endCursorPostId, pageSize, sortBy, sortDirection }) =>
          `v1/public-posts/all/${endCursorPostId}?pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      }),
    }
  },
})

export const {
  useGetUserPostsQuery,
  useAddUserPostsMutation,
  useUpdateUserPostMutation,
  useDeleteUserPostMutation,
  useGetPublicPostsQuery,
} = postsApi
