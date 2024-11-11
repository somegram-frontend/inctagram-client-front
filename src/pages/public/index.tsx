
import { wrapper } from '@/store'
import '@honor-ui/inctagram-ui-kit/css'
import { GetStaticPropsResult } from 'next'
import { RegisteredUsersList } from './registeredUsersList/RegisteredUsersList'
import { getRunningQueriesThunk, getTotalUsersCount, useGetTotalUsersCountQuery } from '@/api/user/users-api'
import { useGetPublicPostsQuery } from '@/api/post/posts-api'
import { PublicPost } from './publicPost/PublicPost'

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
  const{data: publicPosts} = useGetPublicPostsQuery({pageSize: 8, sortBy: 'createdAt', sortDirection: 'desc'})
  return (
    <div>
      PUBLIC PAGE
      <RegisteredUsersList usersCount={totalUsersCount?.totalCount}/>
      {publicPosts?.items.map(el => <PublicPost item={el}/>)}
      
    </div>
    )
}
