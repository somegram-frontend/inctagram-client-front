import NavigationLayout from '@/components/layout/NavigationLayout'
import { useMeQuery } from '@/api/auth-api'
import { useRouter } from 'next/router'
import { Loader } from '@/components/loader/Loader'

const Profile = () => {
  const router = useRouter()
  const { data, isLoading } = useMeQuery()

  if (data && data.userId) {
    router.push(`/user/${data.userId}`)
  }

  if (isLoading) return <Loader />

  return <NavigationLayout isAuth={true}></NavigationLayout>
}

export default Profile
