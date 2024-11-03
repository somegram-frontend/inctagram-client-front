import Layout from '@/pages/_layout'
import { useMeQuery } from '@/api/auth-api'
import { useRouter } from 'next/router'
import { Loader } from '@/components/loader'

const Profile = () => {
  const router = useRouter()
  const { data, isLoading } = useMeQuery()

  if (data && data.userId) {
    router.push(`/user/${data.userId}`)
  }

  if (isLoading) return <Loader />

  return <Layout isAuth={true}></Layout>
}

export default Profile
