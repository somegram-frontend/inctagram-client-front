import '@honor-ui/inctagram-ui-kit/css'
import { RegisteredUsersList } from './registeredUsersList/RegisteredUsersList'
import { PublicPost } from './publicPost/PublicPost'
import s from './public.module.scss'
import { GetTotalCountResponse } from '@/api/user/users-api.types'
import Layout from '@/layout'
import { GetPublicPostsResponse } from '@/api/post/posts-api.types'


type Props = {
  totalUsersCount: GetTotalCountResponse
  publicPosts: GetPublicPostsResponse
}

export const getStaticProps = async () => {
  const totalUsersRes = await fetch('https://somegram.online/api/v1/public-users')
  const totalUsersCount = await totalUsersRes.json()

  const publicPostsRes = await fetch('https://somegram.online/api/v1/public-posts/all/{endCursorPostId}?pageSize=4&sortBy=createdAt&sortDirection=desc')
  const publicPosts = await publicPostsRes.json()

  return {
    props: {
      totalUsersCount,
      publicPosts
    },
    revalidate: 60
  }
}


export default function Public({totalUsersCount, publicPosts}: Props) {
  return (
    <Layout>
    <div className={s.publicPage}>
      <RegisteredUsersList usersCount={totalUsersCount?.totalCount}/>
      <div className={s.publicPosts}>
      {publicPosts?.items.map(el => <PublicPost item={el} key={el.id}/>)}
      </div>
    </div>
    </Layout>
    )
}
