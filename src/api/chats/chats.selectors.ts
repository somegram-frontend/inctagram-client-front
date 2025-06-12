import { AppState } from '@/store'

export const selectedUserForMessenger = (state: AppState) => state.chats.selectedUser
export const selectedChatIdData = (state: AppState) => state.chats.selectedChatId
