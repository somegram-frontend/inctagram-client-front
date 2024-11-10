import { getRunningQueriesThunk, getTotalCount, useGetTotalCountQuery } from '@/api/public-users/public-users-api'
import { wrapper } from '@/store'
import '@honor-ui/inctagram-ui-kit/css'
import { GetStaticPropsResult } from 'next'
import { RegisteredUsersList } from './registeredUsersList/RegisteredUsersList'

type Props = {
  totalCount: number
}

export const getStaticProps = wrapper.getStaticProps(store => async (): Promise<GetStaticPropsResult<Props>> => {
  const usersCount = await store.dispatch(getTotalCount.initiate(undefined));

  await Promise.all(store.dispatch(getRunningQueriesThunk()));

  return {
    props: {
      totalCount: usersCount.data ? usersCount.data.totalCount : 0,
    },
    revalidate: 60,
  };
});



export default function Public() {
  const {data} = useGetTotalCountQuery()
  return (
    <div>
      PUBLIC PAGE
      <RegisteredUsersList usersCount={data?.totalCount}/>
    </div>
    )
}
