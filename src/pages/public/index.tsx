import { wrapper } from '@/store'
import '@honor-ui/inctagram-ui-kit/css'
import { GetStaticPropsResult } from 'next'
import { RegisteredUsersList } from './registeredUsersList/RegisteredUsersList'
import { getRunningQueriesThunk, getTotalUsersCount, useGetTotalUsersCountQuery } from '@/api/user/users-api'
import { useGetPublicPostsQuery } from '@/api/post/posts-api'
import { PublicPost } from './publicPost/PublicPost'
import s from './public.module.scss'


type Props = {
  totalCount: number
}

export const getStaticProps = wrapper.getStaticProps(store => async (): Promise<GetStaticPropsResult<Props>> => {
  const usersCount = await store.dispatch(getTotalUsersCount.initiate(undefined));

  await Promise.all(store.dispatch(getRunningQueriesThunk()));

  return {
    props: {
      totalCount: usersCount.data ? usersCount.data.totalCount : 0,
    },
    revalidate: 60,
  };
});



export default function Public() {
  const {data: totalUsersCount} = useGetTotalUsersCountQuery()
  const{data: publicPosts} = useGetPublicPostsQuery({pageSize: 4, sortBy: 'createdAt', sortDirection: 'desc'})
  return (
    <div className={s.publicPage}>
      <RegisteredUsersList usersCount={totalUsersCount?.totalCount}/>
      <div className={s.publicPosts}>
      {publicPosts?.items.map(el => <PublicPost item={el} key={el.id}/>)}
      </div>
    </div>
    )
}
