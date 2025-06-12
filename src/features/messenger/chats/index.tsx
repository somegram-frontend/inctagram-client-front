import { ChatItem } from '@/api/chats/chats-api.types'
import { Chat } from './chat/Chat'

type Props = {
  chats: ChatItem[]
}
export const Chats = ({ chats }: Props) => {
  return (
    <>
      {chats.map(chat => (
        <Chat
          key={chat.id}
          id={chat.participant.id}
          chatId={chat.id}
          userName={chat.participant.username}
          avatarUrl={chat.participant.avatarUrl}
          isYouLastedMessage={chat.lastMessage.isMine}
          message={chat.lastMessage.content}
          createdAt={chat.lastMessage.createdAt}
        />
      ))}
    </>
  )
}
