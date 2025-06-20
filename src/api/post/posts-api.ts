import { baseApi } from '@/api/_base/base-api'
import {
  AddUserPostsArgs,
  ApiResponse,
  GetPublicPostByIdArgs,
  GetPublicPostByIdResponse,
  GetPublicPostsArgs,
  GetPublicPostsResponse,
  GetUserPostsArgs,
  GetUserPostsResponse,
  Items,
  PostsFollowingParams,
  ResPostsFollowing,
  ToggleLikePostArgs,
  UpdateUserPostArgs,
  UpdateUserPostResponse,
} from './posts-api.types'
import { AppDispatch } from '@/store'

export const replacePostInCache = (dispatch: AppDispatch, post: Items) => {
  const collections = [
    { endpointName: 'getPublicPosts', args: { endCursorPostId: '', pageSize: 8 } },
    {
      endpointName: 'getPostsFollowing',
      args: { endCursorPostId: '', pageSize: 8, sortBy: undefined, sortDirection: undefined },
    },
  ] as const

  collections.forEach(({ endpointName, args }) => {
    dispatch(
      postsApi.util.updateQueryData(endpointName, args, data => {
        const index = data.items.findIndex(p => p.id === post.id)
        if (index !== -1) data.items[index] = post
      }),
    )
  })
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserPosts: builder.query<GetUserPostsResponse, GetUserPostsArgs>({
      query: ({ userId, pageNumber = 1, pageSize = 16 }) =>
        `v1/posts/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: result =>
        result
          ? [
              { type: 'UserPosts' },
              ...result.items.map(({ id }) => ({ type: 'UserPosts' as const, id })),
            ]
          : [{ type: 'UserPosts' }],
    }),

    getPostsFollowing: builder.query<ResPostsFollowing, PostsFollowingParams>({
      query: ({ endCursorPostId = '', pageNumber, pageSize, sortBy, sortDirection }) => ({
        url: `v1/following/posts/${endCursorPostId}`,
        params: { pageSize, sortBy, sortDirection, pageNumber },
      }),

      serializeQueryArgs: () => 'LIST',

      merge: (currentCache, newItems, { arg }) => {
        if (!arg.endCursorPostId || arg.endCursorPostId === '') {
          return newItems
        }

        if (!newItems?.items) {
          return currentCache
        }

        const existingIds = new Set(currentCache?.items?.map(item => item.id))
        const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

        return {
          ...newItems,
          items: [...currentCache.items, ...uniqueNewItems],
          totalCount: newItems.totalCount,
          pageNumber: newItems.pageNumber,
          pagesCount: newItems.pagesCount,
          pageSize: newItems.pageSize,
        }
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
      },

      providesTags: result =>
        result
          ? [
              { type: 'Posts', id: 'LIST' },
              ...(result.items
                ? result.items.map(({ id }) => ({ type: 'Posts' as const, id }))
                : []),
            ]
          : [{ type: 'Posts', id: 'LIST' }],
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
      invalidatesTags: ['UserPosts'],
    }),

    updateUserPost: builder.mutation<UpdateUserPostResponse, UpdateUserPostArgs>({
      query: ({ postId, description }) => ({
        url: `v1/posts/${postId}`,
        method: 'PUT',
        body: { description },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'UserPosts', id: postId }],
    }),

    deleteUserPost: builder.mutation<ApiResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `v1/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'UserPosts', id: postId }],
    }),

    getPublicPosts: builder.query<GetPublicPostsResponse, GetPublicPostsArgs>({
      query: ({ endCursorPostId, ...params }) => ({
        url: `v1/public-posts/all/${endCursorPostId}`,
        params,
      }),
      providesTags: ['PublicPosts'],
    }),

    getPostById: builder.query<GetPublicPostByIdResponse, GetPublicPostByIdArgs>({
      query: ({ postId, ...params }) => ({
        url: `v1/public-posts/${postId}`,
        params,
      }),
      providesTags: (_, __, { postId }) => [{ type: 'Posts', id: postId }],
    }),

    getPublicPostsForLeed: builder.query<GetPublicPostsResponse, GetPublicPostsArgs>({
      query: ({ endCursorPostId, ...params }) => ({
        url: `v1/public-posts/all/${endCursorPostId}`,
        params,
      }),
      serializeQueryArgs: () => ['PublicPosts', 'LIST'],

      merge: (currentCache, newItems, { arg }) => {
        if (!arg.endCursorPostId || arg.endCursorPostId === '') {
          return newItems
        }

        if (!newItems?.items) {
          return currentCache
        }

        const existingIds = new Set(currentCache?.items?.map(item => item.id))
        const uniqueNewItems = newItems.items.filter(item => !existingIds.has(item.id))

        return {
          ...newItems,
          items: [...currentCache.items, ...uniqueNewItems],
          totalCount: newItems.totalCount,
          pageNumber: newItems.pageNumber,
          pagesCount: newItems.pagesCount,
          pageSize: newItems.pageSize,
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
      },

      providesTags: result =>
        result
          ? [
              { type: 'PublicPosts', id: 'LIST' },
              ...(result.items
                ? result.items.map(({ id }) => ({ type: 'PublicPosts' as const, id }))
                : []),
            ]
          : [{ type: 'PublicPosts', id: 'LIST' }],
    }),

    toggleLikePost: builder.mutation<void, ToggleLikePostArgs>({
      query: ({ postId, status }) => ({
        url: `/v1/posts/like/${postId}`,
        method: 'PUT',
        body: { status },
      }),
      async onQueryStarted({ postId, status }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          const result = await dispatch(postsApi.endpoints.getPostById.initiate({ postId }))

          if (result.data) {
            console.log('result', result.data)
            replacePostInCache(dispatch, {
              ...result.data,
              like: {
                myStatus: status,
                likeCount: result.data.like.likeCount,
                lastLikeUser: result.data.like.lastLikeUser,
              },
            })
          }
        } catch (error) {}
      },
      invalidatesTags: (_, __, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'PublicPosts', id: postId },
        { type: 'UserPosts', id: postId },
      ],
    }),
  }),
})

export const {
  useGetUserPostsQuery,
  useAddUserPostsMutation,
  useUpdateUserPostMutation,
  useDeleteUserPostMutation,
  useGetPublicPostsQuery,
  useToggleLikePostMutation,
  useGetPublicPostsForLeedQuery,
  useGetPostsFollowingQuery,
} = postsApi
