import { Avatar } from '@/components/avatar'

import s from './chat.module.scss'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import TimeAgo from 'react-timeago'
import { useAppDispatch, useAppSelector } from '@/store'
import { chatsActions } from '@/api/chats/chats.slice'
import { selectedChatIdData, selectedUserForMessenger } from '@/api/chats/chats.selectors'
import { truncate } from '@/shared/utils/truncate'
import { formatChatTime } from '@/shared/utils/formatChatTime'

type Props = {
  id: string
  createdAt: string
  userName: string
  isYouLastedMessage: boolean
  message: string
  avatarUrl?: string
  chatId: string
  onClick?: () => void
}

export const Chat = (props: Props) => {
  const { userName, isYouLastedMessage, message, avatarUrl, createdAt, id, chatId } = props
  const dispatch = useAppDispatch()
  const selectedChatId = useAppSelector(selectedChatIdData)
  const selectedUser = useAppSelector(selectedUserForMessenger)

  const selectChat = () => {
    dispatch(chatsActions.setSelectedUser({ userName, id, avatarUrl }))
    dispatch(chatsActions.setSelectedChatId(chatId))
  }

  const messageText = truncate(message, 18)

  const selectedChat = selectedChatId === chatId && selectedUser.id === id

  return (
    <div className={`${s.dialog} ${selectedChat ? s.dialogSelected : ''}`} onClick={selectChat}>
      <Avatar
        alt={`${userName} avatar`}
        imgSrc={avatarUrl}
        userName={userName}
        height={48}
        width={48}
      />
      <div className={s.dialogInfo}>
        <div className={s.header}>
          <Typography variant={'regular_text14'}>{truncate(userName, 13)}</Typography>
          <Typography variant={'small_text'}>{formatChatTime(createdAt)}</Typography>
        </div>
        <Typography variant={'small_text'} className={s.message}>
          {isYouLastedMessage ? 'You: ' + messageText : messageText}
        </Typography>
      </div>
    </div>
  )
}
