import {useEffect, useState} from "react";
import {ResNotifications} from "@/api/notifications/notifications-api.types";
import {io} from "socket.io-client";

type Params = {
  notificationsStory?: ResNotifications[]
}
export const useNotification = ({notificationsStory}: Params) => {
  const [notifications, setNotifications] = useState<ResNotifications[]>([])

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

    })

    newSocket.on('connect_error', error => {
      console.error('Ошибка:', error.message)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return {notifications}
};
