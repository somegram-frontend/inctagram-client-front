import { useGetUserPostsQuery } from '@/api/posts-api'
import { useRouter } from 'next/router'
import NavigationLayout from '@/components/layout/NavigationLayout'

const Profile = () => {
  const router = useRouter()
  let id = JSON.stringify(router.query.id)
  const { data } = useGetUserPostsQuery({ userId: id })

  return (
    <NavigationLayout isAuth={true}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'calc(99vh - 60px)',
        }}
      >
        My Profile
        {data?.items.map(el => <div>{JSON.stringify(el)}</div>)}
      </div>
    </NavigationLayout>
  )
}

export default Profile
