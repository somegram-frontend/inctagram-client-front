import { useMeQuery } from '@/api/auth/auth-api'
import { useRouter } from 'next/router'
import { Loader } from '@/components/loader'

const Profile = () => {
  const router = useRouter()
  const { data, isLoading } = useMeQuery()

  if (data && data.userId) {
    router.push(`/user/${data.userId}`)
  } else {
    if (typeof window !== 'undefined') {
      router.push(`/`)
    }
  }

  if (isLoading) return <Loader />
}

export default Profile
