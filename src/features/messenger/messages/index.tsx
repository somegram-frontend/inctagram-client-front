import { Button, ImageOutline, Input, MicOutline } from '@honor-ui/inctagram-ui-kit'
import { useState, KeyboardEvent, useEffect, ChangeEvent } from 'react'
import { useAppSelector } from '@/store'
import { selectedChatIdData, selectedUserForMessenger } from '@/api/chats/chats.selectors'
import { MessagesList } from '@/features/messenger/messages/messages-list'
import { useGetMessagesQuery } from '@/api/chats/chats-api'
import s from './messages.module.scss'
import { useMessengerSocket } from '@/wss/messeger/lib'

type Props = {
  refetchChats: () => void
}

export const Messages = ({ refetchChats }: Props) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [chatId, setChatId] = useState<string>('')

  const [pageNumber, setPageNumber] = useState(1)
  const [endCursorChatId, setEndCursorChatId] = useState<number | undefined>()

  const selectedUser = useAppSelector(selectedUserForMessenger)
  const selectedChatId = useAppSelector(selectedChatIdData)

  const { data, refetch } = useGetMessagesQuery(
    {
      query: {
        pageNumber: pageNumber,
        pageSize: 100,
      },
      endCursorChatId,
      chatId: selectedChatId,
    },
    {
      skip: !selectedChatId,
    },
  )

  const messages = data?.items

  const handleElementVisible = (id: string) => {
    console.log('read')
    readMessage({ messageId: id })
  }

  const updateMessenger = () => {
    refetch()
    refetchChats()
  }

  const { sendMessage, readMessage, leaveChat, connected } = useMessengerSocket({
    onNewMessage: updateMessenger,
    onNewChatMessage: updateMessenger,
    onJoined: updateMessenger,
  })

  useEffect(() => {
    if (selectedChatId !== chatId) {
      leaveChat({ chatId: selectedChatId })
      setChatId(selectedChatId)
    }
  }, [selectedChatId])

  const sendMessageHandler = () => {
    if (!inputValue.trim()) return

    sendMessage({
      participantId: selectedUser.id,
      message: inputValue,
    })
    setInputValue('')
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessageHandler()
    }
  }

  const onClickButton = () => {
    sendMessageHandler()
  }

  return (
    <div className={s.chat}>
      <div className={s.messagesList}>
        {!!selectedChatId && <MessagesList messages={messages} onVisible={handleElementVisible} />}
      </div>
      <div className={s.inputSection}>
        <Input
          value={inputValue}
          onChange={onInputChange}
          className={s.input}
          placeholder={'Type Message'}
          onKeyPress={onKeyPress}
        />
        <div className={s.actionBtns}>
          {!!inputValue ? (
            <Button
              disabled={!connected}
              onClick={onClickButton}
              className={s.button}
              variant={'borderless'}
            >
              Send Message
            </Button>
          ) : (
            <>
              <MicOutline width={24} height={24} />
              <ImageOutline width={24} height={24} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
