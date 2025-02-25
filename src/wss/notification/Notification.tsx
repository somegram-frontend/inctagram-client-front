import React, {useEffect, useState} from 'react';
import {io} from "socket.io-client";

export const Notification = () => {

  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const newSocket = io('wss://somegram.online/notification', {
      transports: ['polling', "websocket"],
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });


    newSocket.onAny((event, data) => {
      console.log(`Получено событие: ${event}`, data);
    });

    newSocket.on("connect", () => {
      console.log("Подключено к серверу");
    });

    newSocket.on('new_notification', (data) => {
      console.log('New notification received:', data);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Ошибка:", error.message);
    });


    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <section>

    </section>
  );
};
