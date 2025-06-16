import { baseApi } from '@/api/_base/base-api'
import {
  GetChatsPayload,
  GetChatsResponse,
  GetMessagesPayload,
  GetMessagesResponse,
} from './chats-api.types'

export const chatsApi = baseApi.injectEndpoints({
  endpoints: build => {
    return {
      getChats: build.query<GetChatsResponse, GetChatsPayload>({
        query: ({ query, endCursorChatId }) => {
          return {
            url: endCursorChatId ? `/v1/messenger/chat/${endCursorChatId}` : '/v1/messenger/chat',
            params: query,
          }
        },
        providesTags: (result, error, { query }) => [
          // 'Chats',
          { type: 'Chats', page: query.pageNumber },
          // ...(result?.items.map(chat => ({ type: 'Chat' as const, id: chat.id })) || []),
        ],
        serializeQueryArgs: ({ queryArgs }) => {
          const { endCursorChatId, ...baseArgs } = queryArgs
          return baseArgs
        },
        merge: (currentCache, newItems, { arg }) => {
          if (arg.endCursorChatId) {
            return {
              chats: [...(currentCache?.items || []), ...newItems.items],
              ...newItems,
            }
          }
          return newItems
        },
        forceRefetch({ currentArg, previousArg }) {
          return currentArg?.query.pageNumber !== previousArg?.query.pageNumber
        },
      }),

      getMessages: build.query<GetMessagesResponse, GetMessagesPayload>({
        query: ({ query, endCursorChatId, chatId }) => {
          return {
            url: endCursorChatId
              ? `/v1/messenger/chat/${chatId}/messages/${endCursorChatId}`
              : `/v1/messenger/chat/${chatId}/messages`,
            params: query,
          }
        },
        serializeQueryArgs: ({ queryArgs }) => queryArgs,
        providesTags: (_, __, { chatId, endCursorChatId, query }) => [
          'Messages',
          { type: 'Messages', id: chatId, cursor: endCursorChatId, page: query.pageNumber },
        ],

        merge: (currentCache, newResponse) => {
          const mergedItems = [...(currentCache?.items || []), ...newResponse.items]

          return {
            ...newResponse,
            items: mergedItems,
          }
        },
      }),
    }
  },
})

export const { useGetChatsQuery, useGetMessagesQuery } = chatsApi
