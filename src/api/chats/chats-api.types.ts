export interface GetChatsPayload {
  query: {
    pageSize: number
    pageNumber: number
    search?: string
  }
  endCursorChatId: string | ''
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
  endCursorChatId?: string
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
  content: string
  createdAt: string
  chatId: string
  messageType: string
  duration: any
  sender: Sender
  participant: Participant
}

export interface Sender {
  username: string
  avatarUrl: any
  isBan: boolean
  userId: string
  readAt: string
  readStatus: boolean
}

export interface Participant {
  username: string
  avatarUrl: string
  isBan: boolean
  userId: string
  readAt: any
  readStatus: boolean
}
