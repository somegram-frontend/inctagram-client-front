import { ChatItem } from '@/api/chats/chats-api.types'
import { Chat } from './chat/Chat'
import s from '@/features/messenger/messages/messages-list/messages-list.module.scss'

type Props = {
  chats: ChatItem[]
  lastElementRef?: React.RefObject<HTMLDivElement>
}
export const Chats = ({ chats, lastElementRef }: Props) => {
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
      <div className={s.cursor} ref={lastElementRef} />
    </>
  )
}
