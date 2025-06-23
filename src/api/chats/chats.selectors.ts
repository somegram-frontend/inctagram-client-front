import { AppState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'
import { chatsApi } from '@/api/chats/chats-api'

export const selectedChatIdData = (state: AppState) => state.chats.selectedChatId
export const selectedUserForMessenger = (state: AppState) => state.chats.selectedUser

export const selectMessagesByChat = createSelector(
  [(state: AppState) => state, (state: AppState, chatId: string) => chatId],
  (state, chatId) => {
    if (!chatId) return null

    return chatsApi.endpoints.getMessages.select({
      chatId,
      query: { pageSize: 10, pageNumber: 1 },
    })(state)
  },
)

export const selectUnreadMessagesCount = createSelector(
  [
    (state: AppState, chatId: string, userId: string) => selectMessagesByChat(state, chatId),
    (state: AppState, chatId: string, userId: string) => userId,
  ],
  (messagesState, userId) => {
    if (!messagesState?.data?.items) return 0

    return messagesState.data.items.filter(
      message => message.sender.userId !== userId && !message.participant.readStatus,
    ).length
  },
)

export const selectMessagesLoadingState = createSelector([selectMessagesByChat], messagesState => ({
  isLoading: messagesState?.isLoading ?? false,
  isFetching: messagesState?.isSuccess ?? false,
  error: messagesState?.error,
}))

export const selectHasMoreMessages = createSelector([selectMessagesByChat], messagesState => {
  if (!messagesState?.data) return false

  const { items, totalCount } = messagesState.data
  return (items?.length || 0) < totalCount
})

export const selectChatsWithUnreadCount = createSelector(
  [
    (state: AppState) =>
      chatsApi.endpoints.getChats.select({
        endCursorChatId: '',
        query: { pageSize: 20, pageNumber: 1 },
      })(state),
    (state: AppState) => state,
    (state: AppState, userId: string) => userId,
  ],
  (chatsState, rootState, userId) => {
    if (!chatsState?.data?.items) return []

    return chatsState.data.items.map(chat => {
      const unreadCount = selectUnreadMessagesCount(rootState, chat.id, userId)

      return {
        ...chat,
        unreadCount,
      }
    })
  },
)

export const createChatMessagesSelector = (chatId: string) =>
  createSelector([(state: AppState) => state], state => selectMessagesByChat(state, chatId))

export const createChatSummarySelector = (chatId: string, userId: string) =>
  createSelector([(state: AppState) => state], state => {
    const messagesState = selectMessagesByChat(state, chatId)
    const lastMessage = messagesState?.data?.items?.[0] || null
    const unreadCount = selectUnreadMessagesCount(state, chatId, userId)

    return {
      messages: messagesState?.data?.items || [],
      totalCount: messagesState?.data?.totalCount || 0,
      lastMessage,
      unreadCount,
      isLoading: messagesState?.isLoading ?? false,
      isFetching: messagesState?.isSuccess ?? false,
      error: messagesState?.error,
    }
  })
