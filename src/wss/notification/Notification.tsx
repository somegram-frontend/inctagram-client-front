import { useEffect, useRef } from 'react'
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
import { useTranslation } from '@/shared/hooks'
import { useNotification } from '@/wss/notification/lib/useNotification'

type Props = {
  className?: string
}
export const Notification = ({ className }: Props) => {
  const notification = useTranslation('notifications')

  const {
    data: notificationsStory,
    isLoading: isLodStory,
    isError: isErrorStory,
    error: errStory,
  } = useGetNotificationsQuery()

  const [reedNotification, { isError: isErrReed, error: errReed }] = useReedNotificationsMutation()
  const { notifications } = useNotification({ notificationsStory })

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
    if (isErrorStory || isErrReed) {
      const errorMessage =
        (errStory && (errStory as Error).message) ||
        (errReed instanceof Error && errReed.message) ||
        'Произошла ошибка'
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
          <DropdownMenuLabel className={s.label}>{notification.title}</DropdownMenuLabel>

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
                        {notification.newNotification}
                        {!story.isRead && <span>{notification.new}</span>}
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
