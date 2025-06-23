import React, { useState, ChangeEvent, KeyboardEvent, useCallback } from 'react'
import { Button, ImageOutline, Input, MicOutline } from '@honor-ui/inctagram-ui-kit'
import { useAppSelector } from '@/store'
import { selectedChatIdData, selectedUserForMessenger } from '@/api/chats/chats.selectors'
import { MessagesList } from '@/features/messenger/messages/messages-list'
import { useInfiniteScroll } from '@/shared/hooks'
import s from './messages.module.scss'
import { useMessagesWithSocket } from '@/api/chats/chats-api'

type Props = {
  refetchChats: () => void
}

export const Messages = ({ refetchChats }: Props) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [pageNumber, setPageNumber] = useState(1)

  const selectedUser = useAppSelector(selectedUserForMessenger)
  const selectedChatId = useAppSelector(selectedChatIdData)

  const { messages, isFetching, hasMoreItems, loadMore, sendMessage, readMessage, connected } =
    useMessagesWithSocket(selectedChatId, refetchChats, pageNumber, setPageNumber)

  console.log(isFetching, hasMoreItems, loadMore)

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  const handleElementVisible = useCallback(
    (messageId: string) => {
      const message = messages.find(msg => msg.id === messageId)
      readMessage({ messageId })

      if (message?.participant.userId === selectedUser.id && !message?.participant.readStatus) {
        readMessage({ messageId })
      }
    },
    [messages, selectedUser.id, readMessage],
  )

  const sendMessageHandler = useCallback(() => {
    if (!inputValue.trim() || !connected) return

    sendMessage({
      participantId: selectedUser.id,
      message: inputValue,
    })
    setInputValue('')
  }, [inputValue, connected, sendMessage, selectedUser.id])

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessageHandler()
    }
  }

  return (
    <div className={s.chat}>
      <div className={s.messagesList}>
        {selectedChatId && (
          <MessagesList
            messages={messages}
            onVisible={handleElementVisible}
            lastElementRef={lastElementRef}
          />
        )}
      </div>
      <div className={s.inputSection}>
        <Input
          value={inputValue}
          onChange={onInputChange}
          className={s.input}
          placeholder="Type Message"
          onKeyPress={onKeyPress}
        />
        <div className={s.actionBtns}>
          {inputValue ? (
            <Button
              disabled={!connected}
              onClick={sendMessageHandler}
              className={s.button}
              variant="borderless"
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
