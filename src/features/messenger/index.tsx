import { Input, Typography } from '@honor-ui/inctagram-ui-kit'
import { useEffect, useRef, useState } from 'react'
import { useGetChatsQuery } from '@/api/chats/chats-api'
import { Chats } from './chats'
import { Messages } from '@/features/messenger/messages'
import { selectedChatIdData, selectedUserForMessenger } from '@/api/chats/chats.selectors'
import { useAppDispatch, useAppSelector } from '@/store'
import { Avatar } from '@/components/avatar'
import { chatsActions } from '@/api/chats/chats.slice'
import s from './messenger.module.scss'
import { useMessengerSocket } from '@/wss/messeger/lib'

export const Messenger = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [endCursorChatId, setEndCursorChatId] = useState<number | ''>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const selectedUser = useAppSelector(selectedUserForMessenger)
  const selectedChatId = useAppSelector(selectedChatIdData)
  const dispatch = useAppDispatch()

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const { data: chatsData, refetch: refetchChats } = useGetChatsQuery({
    query: {
      pageNumber,
      pageSize: 100,
      search: searchQuery,
    },
    endCursorChatId,
  })

  const {} = useMessengerSocket({
    onNewMessage: () => {
      refetchChats()
      console.log('refetchChats new message')
    },
    onNewChatMessage: () => {
      refetchChats()
      console.log('refetchChats -> ')
    },
  })

  useEffect(() => {
    const chat = chatsData?.items.find(chat => chat.participant.id === selectedUser.id)

    if (chat) {
      if (chat.id !== selectedChatId) {
        dispatch(chatsActions.setSelectedChatId(chat.id))
      }
    } else {
      dispatch(chatsActions.setSelectedChatId(''))
    }
  }, [selectedUser, chatsData])

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(value)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  const clearInput = () => {
    setInputValue('')
    setSearchQuery('')
  }

  return (
    <div className={s.messenger}>
      <div className={s.messengerHeader}>
        <div className={s.search}>
          <Input
            onChange={onChangeHandler}
            className={s.searchInput}
            search
            value={inputValue}
            onInputClear={clearInput}
            placeholder={'Search...'}
          />
        </div>
        <div className={s.userInfo}>
          {!!selectedUser.id && (
            <>
              <Avatar
                alt={`Avatar ${selectedUser.userName}`}
                userName={selectedUser.userName}
                imgSrc={selectedUser.avatarUrl}
                width={48}
                height={48}
              />
              <Typography variant={'regular_text16'}>{selectedUser.userName}</Typography>
            </>
          )}
        </div>
      </div>
      <div className={s.messengerContent}>
        <div className={s.chats}>{chatsData && <Chats chats={chatsData.items} />}</div>
        <div className={s.messages}>
          {!!selectedUser.id ? (
            <Messages refetchChats={refetchChats} />
          ) : (
            <div className={s.notSelectedChatId}>
              <Typography className={s.notSelectedChatIdTitle} variant={'medium_text14'}>
                Choose who you would like to talk to
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
