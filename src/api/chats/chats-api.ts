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
        providesTags: ['Chats'],
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
        providesTags: (_, __, { chatId }) => ['Messages', { type: 'Messages', id: chatId }],
      }),
    }
  },
})

export const { useGetChatsQuery, useGetMessagesQuery } = chatsApi
