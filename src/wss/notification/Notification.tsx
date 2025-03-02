import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropDown'
import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './Notification.module.scss'
import {
  useGetNotificationsQuery,
  useReedNotificationsMutation,
} from '@/api/notifications/notifications-api'
import TimeAgo from 'react-timeago'
import { ResNotifications } from '@/api/notifications/notifications-api.types'
import clsx from 'clsx'
import { tryCatch } from '@/shared/utils/tryCatch'
import { BellNotifications } from '@/components/bellNotifications'
import { Loader } from '@/components/loader'
import { toast } from 'react-toastify'

type Props = {
  className?: string
}
export const Notification = ({ className }: Props) => {
  const [notifications, setNotifications] = useState<ResNotifications[]>([])

  const {
    data: notificationsStory,
    isLoading: isLodStory,
    isError: isErrorStory,
    error: errStory,
    refetch,
  } = useGetNotificationsQuery()

  const [reedNotification, { isError: isErrReed, error: errReed }] = useReedNotificationsMutation()
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
    if (notificationsStory) setNotifications(notificationsStory)
  }, [notificationsStory])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const newSocket = io('wss://somegram.online/notification', {
      transports: ['polling', 'websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    newSocket.on('connect', () => {
      console.log('Подключено к серверу')
    })

    newSocket.on('new_notification', data => {
      console.log('New notification received:', data)

      setNotifications(prev => [data, ...prev])

      if (notifications.length % 5 === 0) {
        refetch()
      }
    })

    newSocket.on('connect_error', error => {
      console.error('Ошибка:', error.message)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Обработка ошибок запроса
  useEffect(() => {
    if (isErrorStory || isErrReed) {
      const errorMessage =
        (errStory && (errStory as Error).message) ||
        (errReed instanceof Error && errReed.message) ||
        'Произошла ошибка'
      toast.error(errorMessage)
    }
  }, [isErrorStory, isErrReed, errStory, errReed])

  return (
    <section className={clsx(s.containerNotification, className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className={s.trigger}>
          <BellNotifications<ResNotifications>
            notifications={notifications}
            filterFn={n => !n.isRead}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={s.content}>
          <DropdownMenuLabel className={s.label}>Уведомление</DropdownMenuLabel>

          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            {isLodStory ? (
              <Loader />
            ) : (
              notifications
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
                .reverse()
                .slice(0, 10)
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}
