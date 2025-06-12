export interface GetChatsPayload {
  query: {
    pageSize: number
    pageNumber: number
    search?: string
  }
  endCursorChatId: number | ''
}

export interface GetChatsResponse {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: ChatItem[]
}

export interface ChatItem {
  id: string
  participant: Participant
  lastMessage: LastMessage
}

export interface Participant {
  id: string
  avatarUrl: string
  isBan: boolean
  username: string
}

export interface LastMessage {
  id: string
  isMine: boolean
  content: string
  createdAt: string
  myReadStatus: boolean
}

export interface GetMessagesPayload {
  query: {
    pageSize: number
    pageNumber: number
  }
  chatId: string
  endCursorChatId?: number
}

export interface GetMessagesResponse {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: MessageItem[]
}

export interface MessageItem {
  id: string
  isMine: boolean
  content: string
  chatId: string
  createdAt: string
  senderId: string
  avatarUrl: string
  isBan: boolean
  username: string
  myReadStatus: boolean
  participantReadStatus: boolean
  myReadAt: string
  participantReadAt: string
}
