import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { MessageItem } from '@/api/chats/chats-api.types'

type MessagePayload = {
  message: string
  participantId: string // uuid
}

type ReadMessagePayload = {
  messageId: string // uuid
}

type LeaveChatPayload = {
  chatId: string // uuid
}

type Events = {
  onJoined?: (data: any) => void
  onLeft?: (chatId: string) => void
  onNewMessage?: (data: MessageItem) => void
  onNewChatMessage?: (data: MessageItem) => void
  onReadyMessage?: (data: MessageItem) => void
  onError?: (error: any) => void
}

export const useMessengerSocket = (events: Events) => {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const eventsRef = useRef<Events | undefined>(events)

  useEffect(() => {
    eventsRef.current = events
  }, [events])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const socket = io('wss://somegram.online/messenger', {
      transports: ['polling', 'websocket'],
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('🟢 Connected to messenger WS')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from messenger WS')
      setConnected(false)
    })

    socket.on('joined', data => {
      console.log('✅ Joined chat:', data)
      eventsRef.current?.onJoined?.(data)
    })

    socket.on('left', data => {
      console.log('👋 Left chat:', data)
      eventsRef.current?.onLeft?.(data)
    })

    socket.on('new_message', data => {
      console.log('📩 New message:', data)
      eventsRef.current?.onNewMessage?.(data)
    })

    socket.on('new_chat_message', (data: MessageItem) => {
      console.log('💬 New chat message:', data)
      eventsRef.current?.onNewChatMessage?.(data)
    })

    socket.on('message_read', (data: MessageItem) => {
      // console.log('👁️ Read message:', data)
      eventsRef.current?.onReadyMessage?.(data)
    })

    socket.on('send_message', data => {
      console.log('📤 Message sent:', data)
      eventsRef.current?.onReadyMessage?.(data)
    })

    socket.on('app_error', error => {
      console.error('🔥 WS Error:', error)
      eventsRef.current?.onError?.(error)
    })

    socket.on('connect_error', error => {
      console.error('❌ WS Connection Error:', error.message)
      setConnected(false)
      eventsRef.current?.onError?.(error)
    })

    return () => {
      socket.disconnect()
      setConnected(false)
    }
  }, [])

  const sendMessage = useCallback((payload: MessagePayload) => {
    if (!socketRef.current?.connected) {
      console.warn('⚠️ Socket not connected')
      return false
    }

    console.log('📤 Sending message:', payload)
    socketRef.current.emit('send_message', payload)
    return true
  }, [])

  const readMessage = useCallback((payload: ReadMessagePayload) => {
    if (!socketRef.current?.connected) {
      console.warn('⚠️ Socket not connected')
      return false
    }

    // console.log('👁️ Reading message:', payload)
    socketRef.current.emit('read_message', payload)
    return true
  }, [])

  const leaveChat = useCallback((payload: LeaveChatPayload) => {
    if (!socketRef.current?.connected) {
      console.warn('⚠️ Socket not connected')
      return false
    }

    console.log('🚪 Leaving chat:', payload)
    socketRef.current.emit('leave_chat', payload)
    eventsRef.current?.onLeft?.(payload.chatId)
    return true
  }, [])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
    setConnected(false)
  }, [])

  return {
    connected,
    sendMessage,
    readMessage,
    leaveChat,
    disconnect,
  }
}
