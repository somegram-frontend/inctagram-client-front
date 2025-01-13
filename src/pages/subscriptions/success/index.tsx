import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useMeQuery} from "@/api/auth/auth-api";
import {toast} from "react-toastify";

const Success = () => {
  const router = useRouter()
  const {data, isLoading} = useMeQuery()

  useEffect(() => {
    if (!isLoading && data) {
      const timer = setTimeout(() => {
        router.push(`/user/${data.userId}/profile`);
        toast.success("Payment was successful!")
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [router, isLoading, data]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <h1>Оплата прошла успешно!</h1>
      <p>Вы будете перенаправлены обратно через несколько секунд...</p>
    </div>
  );
};

export default Success;
