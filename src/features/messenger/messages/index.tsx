import { Button, ImageOutline, Input, MicOutline } from '@honor-ui/inctagram-ui-kit'
import { useState, KeyboardEvent, useEffect, ChangeEvent } from 'react'
import { useAppSelector } from '@/store'
import { selectedChatIdData, selectedUserForMessenger } from '@/api/chats/chats.selectors'
import { MessagesList } from '@/features/messenger/messages/messages-list'
import { useGetMessagesQuery } from '@/api/chats/chats-api'
import s from './messages.module.scss'
import { useMessengerSocket } from '@/wss/messeger/lib'
import { useInfiniteScroll } from '@/shared/hooks'
import { MessageItem } from '@/api/chats/chats-api.types'

type Props = {
  refetchChats: () => void
}

export const Messages = ({ refetchChats }: Props) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [chatId, setChatId] = useState<string>('')

  const [pageNumber, setPageNumber] = useState(1)
  const [endCursorChatId, setEndCursorChatId] = useState<string | undefined>()

  const selectedUser = useAppSelector(selectedUserForMessenger)
  const selectedChatId = useAppSelector(selectedChatIdData)

  const { data, refetch, isFetching } = useGetMessagesQuery(
    {
      query: {
        pageNumber: pageNumber,
        pageSize: 10,
      },
      endCursorChatId,
      chatId: selectedChatId,
    },
    {
      skip: !selectedChatId,
    },
  )

  const [messages, setMessages] = useState<MessageItem[] | undefined>([])

  useEffect(() => {
    if (chatId !== selectedChatId) {
      leaveChat({ chatId: selectedChatId })
      setChatId(selectedChatId)
      setMessages(data?.items || [])
    } else setMessages(prevState => [...(prevState || []), ...(data?.items || [])])
  }, [data?.items])

  const totalItems = data?.items?.length || 0
  const totalCount = data?.totalCount || 0

  const loadedItemsCount = (pageNumber - 1) * 10 + totalItems
  const hasMoreItems = totalCount > loadedItemsCount

  const loadMore = () => {
    if (!isFetching && hasMoreItems) {
      setEndCursorChatId(data?.items?.[data.items.length - 1].id)
      console.log(endCursorChatId)
      setPageNumber(prev => prev + 1)
    }
  }

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: hasMoreItems,
    fetchNext: loadMore,
  })

  const handleElementVisible = (id: string) => {
    if (messages?.find(message => message.id === id)?.myReadStatus) return
    readMessage({ messageId: id })
  }

  const updateMessages = () => {
    refetch()
    refetchChats()
  }

  const { sendMessage, readMessage, leaveChat, connected } = useMessengerSocket({
    onNewMessage: data => {
      setMessages(prevState => [data, ...(prevState || [])])
    },
    onNewChatMessage: data => {
      setMessages(prevState => [data, ...(prevState || [])])
    },
    onJoined: updateMessages,
    onReadyMessage: data => {
      setMessages(prevState => {
        if (prevState) {
          return prevState.map(message =>
            message.id === data.messageId ? { ...message, participantReadStatus: true } : message,
          )
        }
      })
    },
  })

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
        {!!selectedChatId && (
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
