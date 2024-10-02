import NavigationLayout from '@/components/layout/NavigationLayout'
import { useMeQuery } from '@/api/auth-api'
import { useRouter } from 'next/router'

const Profile = () => {
  const router = useRouter()
  const { data } = useMeQuery()

  if (data && data.userId) {
    void router.push(`/user/${data.userId}`)
  }

  return <NavigationLayout isAuth={true}>{JSON.stringify(data)}</NavigationLayout>
}

export default Profile
