import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropDown'
import { Button, OutlineBell, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './Notification.module.scss'
import {
  useGetNotificationsQuery,
  useReedNotificationsMutation,
} from '@/api/notifications/notifications-api'
import TimeAgo from 'react-timeago'
import { ResNotifications } from '@/api/notifications/notifications-api.types'
import clsx from 'clsx'
import { tryCatch } from '@/shared/utils/tryCatch'

export const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const {
    data: notificationsStory,
    isLoading: isLodStory,
    isError: isErrorStory,
    error: errStory,
  } = useGetNotificationsQuery()

  const [reedNotification, { isLoading: isLodReed, isError: isErrReed, error: errReed }] =
    useReedNotificationsMutation()
  const saveIdNotification = useRef<null | string>(null)

  const handlerReedNotification = async (notificationId: string, isRead: boolean) => {
    return tryCatch(async () => {
      if (!isRead) {
        saveIdNotification.current = notificationId
        await reedNotification({ notificationId }).unwrap()
      }
    }).finally(() => (saveIdNotification.current = null))
  }

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

          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            {notificationsStory
              ?.map((story: ResNotifications) => (
                <Button
                  key={story.id}
                  className={clsx(s.blockItem, !story.isRead && s.itemHover)}
                  variant={'secondary'}
                  onClick={() => handlerReedNotification(story.id, story.isRead)}
                  disabled={saveIdNotification.current === story.id}
                >
                  <DropdownMenuSeparator className={s.separator} />

                  <section className={clsx(s.item)}>
                    <Typography variant={'bold_text14'} as={'h2'}>
                      Новое уведомление!
                      {!story.isRead && <span>Новое</span>}
                    </Typography>
                    <Typography variant={'small_text'}>
                      {story.message}
                      <span className={s.data}>
                        <TimeAgo date={story.createdAt} live={false} />
                      </span>
                    </Typography>
                  </section>
                </Button>
              ))
              .reverse()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}
