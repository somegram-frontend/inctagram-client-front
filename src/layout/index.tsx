import {Header} from '@/components/header'
import {Sidebars} from '@/components/sidebar'
import {NextPage} from 'next'
import {PropsWithChildren, useEffect, useState} from 'react'
import s from './layout.module.scss'
import {useMeQuery} from '@/api/auth/auth-api'
import {MeErrorResponse} from '@/api/auth/auth-api.types'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {io, Socket} from "socket.io-client";


const Layout: NextPage<PropsWithChildren> = ({children}) => {
  const router = useRouter()
  const [socket, setSocket] = useState<Socket | null>(null);

  const {data, error} = useMeQuery()

  const isAuth = !((error as MeErrorResponse)?.status === 401)

  useEffect(() => {
    if (error && (error as MeErrorResponse)?.status !== 401) {
      toast.error((error as MeErrorResponse)?.data.message)

      if (typeof window !== 'undefined') {
        router.push('/')
      }
    }
  }, [error, router])


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token, 'token')
    if (!token) return;

    const newSocket = io(`wss://somegram.online/notification`, {
      transports: ["websocket"],
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    newSocket.on("connect", () => {
      console.log("Подключено к серверу");
    });

    newSocket.on('notification', (data) => {
      console.log('New notification received:', data);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Ошибка:", error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <>
      <Header isAuth={isAuth}/>
      <div className={s.authContent}>
        {isAuth && <Sidebars isAuth={isAuth} data={data}/>}
        {children}
      </div>
    </>
  )
}

export default Layout
