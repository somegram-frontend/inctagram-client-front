import s from './messages-list.module.scss'
import { Avatar } from '@/components/avatar'
import { CheckmarkOutline, DoneAllOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { formatChatTime } from '@/shared/utils/formatChatTime'
import { MessageItem } from '@/api/chats/chats-api.types'
import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/store'
import { selectedUserForMessenger } from '@/api/chats/chats.selectors'

type Props = {
  messages?: MessageItem[]
  onVisible: (id: string) => void
  lastElementRef?: React.RefObject<HTMLDivElement>
}

export const MessagesList = ({ messages, onVisible, lastElementRef }: Props) => {
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const selectedUser = useAppSelector(selectedUserForMessenger)

  useEffect(() => {
    const currentMessageIds = new Set(messages?.map(m => m.id) || [])

    Object.keys(messageRefs.current).forEach(id => {
      if (!currentMessageIds.has(id)) {
        delete messageRefs.current[id]
      }
    })
  }, [messages])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id')
            if (id) {
              onVisible(id)
              observerRef.current?.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      },
    )

    Object.values(messageRefs.current).forEach(ref => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [messages, onVisible])

  const setMessageRef = (messageId: string) => (el: HTMLDivElement | null) => {
    if (el) {
      messageRefs.current[messageId] = el
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    }
  }

  return (
    <>
      {messages?.map(message => {
        const user =
          selectedUser.id !== message.sender.userId ? message.participant : message.sender
        return selectedUser.id !== message.sender.userId ? (
          <div key={message.id} className={s.mineMessage}>
            <Typography variant={'regular_text14'} className={s.mineMessageText}>
              {message.content}
            </Typography>
            <Typography className={s.mineMessageInfo} variant={'small_text'}>
              {formatChatTime(message.createdAt)}
              {message.participant.readStatus ? (
                <DoneAllOutline width={18} height={16} viewBox={'0 0 22 20'} />
              ) : (
                <CheckmarkOutline width={18} height={16} viewBox={'0 0 22 20'} />
              )}
            </Typography>
          </div>
        ) : (
          <div
            key={message.id}
            className={s.participantMessage}
            data-id={message.id}
            ref={setMessageRef(message.id)}
          >
            <Avatar alt={user.avatarUrl} userName={user.username} width={36} height={36} />
            <div className={s.participantMessageContent}>
              <Typography variant={'regular_text14'} className={s.participantMessageContentText}>
                {message.content}
              </Typography>
              <Typography variant={'small_text'} className={s.participantMessageContentDate}>
                {formatChatTime(message.createdAt)}
              </Typography>
            </div>
          </div>
        )
      })}
      <div className={s.cursor} ref={lastElementRef} />
    </>
  )
}
