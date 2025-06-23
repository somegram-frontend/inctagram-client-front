import { baseApi } from '@/api/_base/base-api'
import {
  GetChatsPayload,
  GetChatsResponse,
  GetMessagesPayload,
  GetMessagesResponse,
  MessageItem,
} from './chats-api.types'
import { useCallback, useEffect, useState } from 'react'
import { useMessengerSocket } from '@/wss/messeger/lib'

const cacheHandlers = new Map<
  string,
  {
    updateMessage: (message: MessageItem) => void
    updateReadStatus: (data: MessageItem) => void
    clearMessages: () => void
  }
>()

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
        providesTags: (result, error, { query }) => [{ type: 'Chats', page: query?.pageNumber }],
        serializeQueryArgs: ({ queryArgs }) => {
          const { query } = queryArgs
          return {
            search: query?.search || '',
          }
        },
        merge: (currentCache, newItems, { arg }) => {
          if (arg.endCursorChatId) {
            return {
              ...newItems,
              items: [...(currentCache?.items || []), ...newItems.items],
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
        providesTags: (result, error, { chatId }) => [{ type: 'Messages', chatId: chatId }],
        serializeQueryArgs: ({ queryArgs }) => {
          return {
            chatId: queryArgs.chatId,
          }
        },
        merge: (currentCache, newItems, { arg }) => {
          if (arg.endCursorChatId && currentCache) {
            const existingIds = new Set(currentCache.items.map(item => item.id))
            const newUniqueItems = newItems.items.filter(item => !existingIds.has(item.id))

            console.log('update', {
              ...newItems,
              items: [...currentCache.items, ...newUniqueItems],
              totalCount: newItems.totalCount, // Обновляем totalCount из нового ответа
            })

            return {
              ...newItems,
              items: [...currentCache.items, ...newUniqueItems],
              totalCount: newItems.totalCount, // Обновляем totalCount из нового ответа
            }
          }
          return newItems
        },
        forceRefetch({ currentArg, previousArg }) {
          return (
            currentArg?.chatId !== previousArg?.chatId ||
            currentArg?.endCursorChatId !== previousArg?.endCursorChatId
          )
        },

        onCacheEntryAdded: async (
          arg,
          { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
        ) => {
          const { chatId } = arg

          await cacheDataLoaded

          const handlers = {
            updateMessage: (message: MessageItem) => {
              updateCachedData(draft => {
                const exists = draft.items.some(item => item.id === message.id)
                if (!exists) {
                  draft.items.unshift(message)
                  draft.totalCount += 1
                }
              })
            },

            updateReadStatus: (data: MessageItem) => {
              updateCachedData(draft => {
                const message = draft.items.find(item => item.id === data.id)
                if (message && message.participant) {
                  message.participant = data.participant
                }
              })
            },

            clearMessages: () => {
              updateCachedData(draft => {
                draft.items = []
                draft.totalCount = 0
              })
            },
          }

          cacheHandlers.set(chatId, handlers)

          await cacheEntryRemoved
          cacheHandlers.delete(chatId)
        },
      }),
    }
  },
})

export const { useGetChatsQuery, useGetMessagesQuery } = chatsApi

export const handleNewChatMessage = (message: MessageItem) => {
  const handlers = cacheHandlers.get(message.chatId)
  if (handlers) {
    handlers.updateMessage(message)
  }
}

export const handleMessageRead = (data: MessageItem) => {
  const handlers = cacheHandlers.get(data.chatId)
  if (handlers) {
    handlers.updateReadStatus(data)
  }
}

export const handleChatClear = (chatId: string) => {
  const handlers = cacheHandlers.get(chatId)
  if (handlers) {
    handlers.clearMessages()
  }
}

export const useMessagesWithSocket = (
  chatId: string,
  refetchChats: () => void,
  pageNumber: number,
  setPageNumber: React.Dispatch<React.SetStateAction<number>>,
) => {
  const [endCursorChatId, setEndCursorChatId] = useState<string | undefined>()

  const { data, isFetching, refetch, isLoading } = useGetMessagesQuery(
    {
      chatId,
      query: { pageNumber, pageSize: 30 },
      endCursorChatId,
    },
    {
      skip: !chatId,
    },
  )

  useEffect(() => {
    if (chatId) {
      setPageNumber(1)
      setEndCursorChatId(undefined)
      refetch()
    }
  }, [chatId, refetch])

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0
  const hasMoreItems = totalCount > totalItems

  console.log('totalCount', totalCount, 'loadedItems:', totalItems)

  const loadMore = useCallback(() => {
    if (data?.items?.length && !isFetching && hasMoreItems) {
      if (totalCount / 30 > pageNumber) {
        console.log('pageNumber', pageNumber)

        const lastMessage = data.items[data.items.length - 1]

        setEndCursorChatId(lastMessage.id)
        setPageNumber(prev => prev + 1)
      }
    }
  }, [isFetching, hasMoreItems, data?.items])

  const { sendMessage, readMessage, leaveChat, connected } = useMessengerSocket({
    onNewChatMessage: (message: MessageItem) => {
      handleNewChatMessage(message)
      refetchChats()
    },
    onNewMessage: data => {
      handleNewChatMessage(data)
      refetchChats()
    },
    onJoined: refetchChats,
    onReadyMessage: (data: MessageItem) => {
      handleMessageRead(data)
    },
    onLeft: (chatId: string) => {
      handleChatClear(chatId)
    },
  })

  return {
    messages: data?.items || [],
    isFetching,
    isLoading,
    hasMoreItems,
    loadMore,
    sendMessage,
    readMessage,
    leaveChat,
    connected,
    totalCount: data?.totalCount || 0,
  }
}
