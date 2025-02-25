import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropDown'
import { OutlineBell, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './Notification.module.scss'
import { useGetNotificationsQuery } from '@/api/notifications/notifications-api'
import TimeAgo from 'react-timeago'

export const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const {
    data: notificationsStory,
    isLoading: isLodStory,
    isError: isErrorStory,
    error: errStory,
  } = useGetNotificationsQuery()
  console.log(notificationsStory)
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const newSocket = io('wss://somegram.online/notification', {
      transports: ['polling', 'websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    newSocket.onAny((event, data) => {
      console.log(`Получено событие: ${event}`, data)
    })

    newSocket.on('connect', () => {
      console.log('Подключено к серверу')
    })

    newSocket.on('new_notification', data => {
      console.log('New notification received:', data)
    })

    newSocket.on('connect_error', error => {
      console.error('Ошибка:', error.message)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <section className={s.containerNotification}>
      <DropdownMenu>
        <DropdownMenuTrigger className={s.trigger}>
          <OutlineBell className={s.bell} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={s.content}>
          <DropdownMenuLabel className={s.label}>Уведомление</DropdownMenuLabel>

          <DropdownMenuItem>
            {notificationsStory?.map(story => (
              <section key={story.id}>
                <DropdownMenuSeparator className={s.separator} />

                <section className={s.item}>
                  <Typography variant={'bold_text14'} as={'h2'}>
                    Новое уведомление!
                  </Typography>
                  <Typography variant={'small_text'}>
                    {story.message}
                    <span className={s.data}>
                      <TimeAgo date={story.createdAt} live={false} />
                    </span>
                  </Typography>
                </section>
              </section>
            ))}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}
