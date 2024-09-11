import NavigationLayout from '@/components/layout/NavigationLayout'
import { useMeQuery } from '@/api/auth-api'

const Profile = () => {
  const { data } = useMeQuery()

  return <NavigationLayout isAuth={true}>{JSON.stringify(data)}</NavigationLayout>
}

export default Profile
